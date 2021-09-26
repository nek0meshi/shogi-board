<template>
  <div>
    <h1>将棋盤</h1>
    <Board />
  </div>
</template>

<script>
import Board from './Board.vue';

export default {
  components: {
    Board,
  },
}
</script>

<style scoped lang="scss">
h1 {
  margin: 10px 30px 50px;
  text-align: left;
  font-size: 35px;

  @media screen and (max-width: 760px) {
    margin-left: 10px;
  }
}

</style>