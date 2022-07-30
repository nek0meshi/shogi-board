<template>
  <div class="board-container">
    <div class="stand second-stand">
      <div
        v-for="p in secondStandPieces"
        :key="p.type"
        class="stand-piece"
        :class="getStandPieceClass(false, p.type)"
      >
        <span
          class="stand-piece-name"
          @click="selectPieceOnStand(false, p.type)"
        >{{ p.name }}</span>
        <span class="stand-piece-count">{{ p.count }}</span>
      </div>
    </div>
    <div class="board">
      <div class="left-frame-container">
        <div
          v-for="r in ROWS"
          :key="r"
          class="left-frame"
        >
          {{ getRowText(r) }}
        </div>
      </div>
      <div
        v-for="c in COLUMNS"
        :key="c"
        class="column"
      >
        <div class="top-frame">
          {{ c }}
        </div>
        <div
          v-for="r in ROWS"
          :key="r"
          class="box"
          :class="getBoxClass(c, r)"
          @click="selectBox(c, r)"
        />
      </div>
      <piece-on-board
        v-for="p in onBoardPieces"
        :key="p.id"
        :piece="p"
        :is-last-moved="lastMovedPieceId === p.id"
        :is-selected="selectedId === p.id"
        @click-piece="selectPiece"
      />
    </div>
    <div class="stand first-stand">
      <div
        v-for="p in firstStandPieces"
        :key="p.type"
        class="stand-piece"
        :class="getStandPieceClass(true, p.type)"
      >
        <span
          class="stand-piece-name"
          @click="selectPieceOnStand(true, p.type)"
        >{{ p.name }}</span>
        <span class="stand-piece-count">{{ p.count }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import useGame from '../composable/use-game'
import PieceOnBoard from './PieceOnBoard.vue'

const COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default {
  components: {
    PieceOnBoard,
  },

  setup() {
    const game = useGame()

    return {
      ...game,
    }
  },

  computed: {
    COLUMNS() {
      return COLUMNS
    },
    ROWS() {
      return ROWS
    },
  },

  methods: {
    getPieceStyle(piece) {
      return {
        right: (21 + 51 * (piece.column - 1)) + 'px',
        top: (21 + 51 * (piece.row - 1)) + 'px',
        transform: 'rotate(' + (piece.isFirst ? 0 : 180) + 'deg)',
      }
    },

    getPieceClass(id) {
      return {
        'selected-piece': this.selectedId === id,
        'last-moved-piece': this.lastMovedPieceId === id,
        'promoted-piece': this.pieces.find((p) => p.id === id)?.isPromoted
      }
    },

    getStandPieceClass(isFirst, type) {
      const isSelected = isFirst === this.isFirst
        && type === this.selectedTypeOnStand
      return {
        'selected-stand-piece': isSelected,
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
.selected-piece {
  background-color: orange;
}
.selected-stand-piece {
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
  cursor: pointer;
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
