<template>
  <div class="board-container">
    <div class="stand second-stand">
      <div v-for="p in secondStandPieces" :key="p.type" class="stand-piece">
        <span class="stand-piece-name">{{ p.name }}</span>
        <span class="stand-piece-count">{{ p.count }}</span>
      </div>
    </div>
    <div class="board">
      <div class="left-frame-container">
        <div v-for="r in ROWS" :key="r" class="left-frame">
          {{ getRowText(r) }}
        </div>
      </div>
      <div v-for="c in COLUMNS" :key="c" class="column">
        <div class="top-frame">{{ c }}</div>
        <div
          v-for="r in ROWS"
          :key="r"
          class="box"
          :class="getBoxClass(c, r)"
          @click="selectBox(c, r)"
        >
        </div>
      </div>
      <div
        v-for="p in onBoardPieces"
        class="piece"
        :style="pieceStyle(p)"
        :key="p.id"
        :class="getPieceClass(p.id)"
        @click="selectPiece(p.id)"
      >
        {{ p.name }}
      </div>
    </div>
    <div class="stand first-stand">
      <div v-for="p in firstStandPieces" :key="p.type" class="stand-piece">
        <span class="stand-piece-name">{{ p.name }}</span>
        <span class="stand-piece-count">{{ p.count }}</span>
      </div>
    </div>
  </div>
</template>

<script>
const COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const reduceStandPieces = (carry, piece) => {
  const c = carry.find((p) => p.type === piece.type)
  if (c) {
    c.count += 1
  } else {
    carry.push({
      type: piece.type,
      name: piece.name,
      count: 1,
    })
  }
  return carry
}

export default {
  props: {
    pieces: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      selectedId: null,
      isFirst: true, // 手番
      lastMovedPieceId: null,
    }
  },

  computed: {
    /*
     * 定数.
     */
    COLUMNS() {
      return COLUMNS
    },
    ROWS() {
      return ROWS
    },

    /*
     * 通常のcomputed properties.
     */
    onBoardPieces() {
      return this.pieces.filter((piece) => piece.column !== null)
    },
    firstStandPieces() {
      return this.pieces
        .filter((piece) => piece.isFirst)
        .filter((piece) => piece.column === null)
        .reduce(reduceStandPieces, [])
    },
    secondStandPieces() {
      return this.pieces
        .filter((piece) => !piece.isFirst)
        .filter((piece) => piece.column === null)
        .reduce(reduceStandPieces, [])
    },
    selected() {
      return this.pieces.find((p) => p.id === this.selectedId)
    },
    currentMovableList() {
      if (!this.selected) {
        return []
      }

      // 先手なら+1, 後手なら-1をかける
      const sign = this.selected.isFirst ? 1 : -1

      return this.selected.movableList
        // 移動量に、手番を反映する.
        .map(([column, row]) => [sign * column, sign * row])
        // 現在のマスから見た移動可能マスに変換
        .flatMap(([column, row]) => {
          if (isFinite(column) && isFinite(row)) {
            return [[this.selected.column + column, this.selected.row + row]]
          }
          // 無限に進める駒.
          // Infinity -> 1, -Infinity -> -1, 0 -> 0.
          const columnSign = Math.sign(column)
          const rowSign = Math.sign(row)

          const res = []
          for (let i of [...Array(8).keys()].map(i => i + 1)) {
            // 移動先のマス.
            const nextBlock = [this.selected.column + i * columnSign, this.selected.row + i * rowSign]

            // 当該マスに今いる駒.
            const existPiece = this.getPiece(nextBlock[0], nextBlock[1])

            if (existPiece) {
              // 当該マスにすでに駒がある場合.
              if (existPiece.isFirst !== this.selected.isFirst) {
                // 敵の駒なら取れる.
                res.push(nextBlock)
              }
              // これ以上先には移動できない.
              break
            }
            res.push(nextBlock)
          }
          return res
        })
        // 番外のマスを除く
        .filter(([column, row]) => column >= 1 && column <= 9 && row >= 1 && row <= 9)
    }
  },

  methods: {
    pieceStyle(piece) {
      return {
        right: (21 + 51 * (piece.column - 1)) + 'px',
        top: (21 + 51 * (piece.row - 1)) + 'px',
        transform: 'rotate(' + (piece.isFirst ? 0 : 180) + 'deg)',
      }
    },

    selectBox(column, row) {
      if (!this.isMovableBox(column, row)) {
        return
      }
      this.movePiece(this.selected, column, row)
    },

    selectPiece(id) {
      const piece = this.pieces.find((p) => p.id === id)

      if (!this.isMovableBox(piece.column, piece.row)) {
        if (this.isFirst === piece.isFirst) {
          this.selectedId = id
        }

        return
      }

      this.movePiece(this.selected, piece.column, piece.row, piece)
    },

    // そのマスにあるコマを取得する.
    getPiece(column, row) {
      return this.pieces.find((p) => p.column === column && p.row === row)
    },

    /**
     * captured 移動時にとった駒
     */
    movePiece(piece, column, row, captured = null) {
      if (captured) {
        captured.isFirst = this.isFirst
        captured.column = null
        captured.row = null
        captured.isPromoted = false
      }

      // 駒を成る
      const isBasefOpponents = (isFirst, row) => isFirst
        ? [1, 2, 3].includes(row)
        : [7, 8, 9].includes(row)
      if (
        piece.canPromoteCurrent && (
          isBasefOpponents(piece.isFirst, piece.row) ||
          isBasefOpponents(piece.isFirst, row)
        )
      ) {
        if (confirm('成りますか？')) {
          piece.isPromoted = true
        }
      }
      piece.column = column
      piece.row = row
      this.lastMovedPieceId = piece.id
      this.isFirst = !this.isFirst
      this.selectedId = null
    },

    getPieceClass(id) {
      return {
        'selected-piece': this.selectedId === id,
        'last-moved-piece': this.lastMovedPieceId === id,
        'promoted-piece': this.pieces.find((p) => p.id === id)?.isPromoted
      }
    },

    getBoxClass(column, row) {
      return {
        'movable-box': this.isMovableBox(column, row),
      }
    },

    getRowText(row) {
      return ['一', '二', '三', '四', '五', '六', '七', '八', '九'][row - 1]
    },

    /**
     * 現在選択中の駒が、移動可能なマスかどうか.
     */
    isMovableBox(column, row) {
      if (!this.selected) {
        return false
      }

      if (
        !!this.pieces.find((piece) => piece.isFirst === this.isFirst
          && piece.column === column
          && piece.row === row)
      ) {
        // すでに自分の駒があるマスの場合
        return false
      }

      return !!this.currentMovableList
        .find(([c, r]) => c === column && r === row)
    }
  },
}
</script>

<style lang="scss" scoped>
$board-size: 50px;
$top-frame-size: 20px;
$board-border-width: 1px;
$border-color: black;

.board-container {
  display: inline-flex;
}
.board {
  display: flex;
  flex-direction: row-reverse;
  position: relative;
}
.column:nth-child(2) .box {
  border-right: $board-border-width solid $border-color;
}
.box {
  border-left: $board-border-width solid $border-color;
  border-bottom: $board-border-width solid $border-color;
  height: $board-size;
  width: $board-size;
}
.movable-box {
  background-color: yellow;
}
.box:nth-child(2) {
  border-top: $board-border-width solid $border-color;
}
.top-frame {
  height: $top-frame-size;
}
.left-frame-container {
  width: 20px;
  padding-top: $top-frame-size;
}
.left-frame {
  height: calc(#{$board-size} + #{$board-border-width});
  line-height: calc(#{$board-size} + #{$board-border-width});
}
.piece {
  position: absolute;
  width: 50px;
  height: 50px;
  font-size: 32px;
  cursor: pointer;
}
.selected-piece {
  background-color: orange;
}
.last-moved-piece {
  background-color: red;
}
.stand {
  width: 70px;
  height: 400px;
  border: $board-border-width solid $border-color;
}
.first-stand {
  margin-left: 20px;
  margin-top: auto;
}
.second-stand {
  margin-right: 20px;
}
.stand-piece {
  display: inline-flex;
  align-items: center;
  height: 50px;
}
.promoted-piece {
  color: brown;
}
.stand-piece-name {
  width: 50px;
  font-size: 32px;
}
.stand-piece-count {
  font-size: 20px;
}
</style>