<template>
  <div
    class="piece"
    :style="pieceStyle"
    :class="pieceClass"
    @click="clickPiece"
  >
    {{ piece.name }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Piece } from '../src/pieces'

export default defineComponent({
  name: 'PieceOnBoard',
  props: {
    piece: {
      type: Object as PropType<Piece>,
    },
    isLastMoved: {
      type: Boolean,
      default: false,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    return {
      pieceStyle: computed(() => ({
        right: (21 + 51 * (props.piece.column - 1)) + 'px',
        top: (21 + 51 * (props.piece.row - 1)) + 'px',
        transform: 'rotate(' + (props.piece.isFirst ? 0 : 180) + 'deg)',
      })),
      pieceClass: computed(() => ({
        'selected-piece': props.isSelected,
        'last-moved-piece': props.isLastMoved,
        'promoted-piece': props.piece.isPromoted,
      })),
      clickPiece: () => {
        context.emit('clickPiece', props.piece.id)
      },
    }
  },
})
</script>

<style scoped>
  .piece {
    position: absolute;
    width: 50px;
    height: 50px;
    font-size: 32px;
    cursor: pointer;
  }
</style>