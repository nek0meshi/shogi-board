<template>
  <Board
    :pieces="pieces"
  />
</template>

<script>
import Board from './Board.vue';
import { Piece } from '../src/pieces';

/**
 * @param name 駒の名前
 * @param positions 先手の駒配置の配列 [[column, row], [column, row], ...]
 * @return 先手後手両方分のPieceのconstructorの引数
 */
const splitFirstAndSecond = (name, positions) => positions
  .flatMap((position) => ([
    // 先手
    [true, position[0], position[1]],
    // 後手
    [false, 10 - position[0], 10 - position[1]],
  ]))
  .map((position) => [name, ...position])

export default {
  components: {
    Board,
  },

  data() {
    return {
      pieces: [],
    }
  },

  created() {
    this.initPieces()
  },

  methods: {
    initPieces() {
      this.pieces = [
        ...splitFirstAndSecond('king', [[5, 9]]),
        ...splitFirstAndSecond('rook', [[2, 8]]),
        ...splitFirstAndSecond('bishop', [[8, 8]]),
        ...splitFirstAndSecond('gold', [[4, 9], [6, 9]]),
        ...splitFirstAndSecond('silver', [[3, 9], [7, 9]]),
        ...splitFirstAndSecond('knight', [[2, 9], [8, 9]]),
        ...splitFirstAndSecond('lance', [[1, 9], [9, 9]]),
        ...splitFirstAndSecond('pawn', [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7]]),
      ]
        .map((params) => new Piece(...params))
    },
  },
}
</script>