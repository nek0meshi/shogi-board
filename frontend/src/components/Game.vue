<template>
  <Board
    :pieces="pieces"
  />
</template>

<script>
import Board from './Board.vue';

export default {
  components: {
    Board,
  },
}
</script>