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
        <div v-for="r in rows" :key="r" class="left-frame">
          {{ getRowText(r) }}
        </div>
      </div>
      <div v-for="c in columns" :key="c" class="column">
        <div class="top-frame">{{ c }}</div>
        <div v-for="r in rows" :key="r" class="box" @click="boxSelect(c, r)">
        </div>
      </div>
      <div
        v-for="p in onBoardPieces"
        class="piece"
        :style="pieceStyle(p)"
        :key="p.id"
        :class="getgetPieceClass(p.id)"
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
      columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      rows: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      selectedId: null,
      isFirst: true, // 手番
      lastMovedPieceId: null,
    }
  },

  computed: {
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

    boxSelect(column, row) {
      if (this.selected) {
        this.selected.column = column
        this.selected.row = row
        this.movePiece(this.selected, column, row)
      }
    },

    selectPiece(id) {
      const piece = this.pieces.find((p) => p.id === id)

      if (this.isFirst === piece.isFirst) {
        this.selectedId = id

        return
      }

      if (!this.selected) {
        return
      }

      this.movePiece(this.selected, piece.column, piece.row, piece)
    },

    movePiece(piece, column, row, captured = null) {
      if (captured) {
        captured.isFirst = this.isFirst
        captured.column = null
        captured.row = null
      }
      piece.column = column
      piece.row = row
      this.lastMovedPieceId = piece.id
      this.isFirst = !this.isFirst
      this.selectedId = null
    },

    getgetPieceClass(id) {
      return {
        'selected-piece': this.selectedId === id,
        'last-moved-piece': this.lastMovedPieceId === id,
      }
    },

    getRowText(row) {
      return ['一', '二', '三', '四', '五', '六', '七', '八', '九'][row - 1]
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
  // transform: rotate(180deg);
}
.stand-piece {
  display: inline-flex;
  align-items: center;
  height: 50px;
}
.stand-piece-name {
  width: 50px;
  font-size: 32px;
}
.stand-piece-count {
  font-size: 20px;
}
</style>