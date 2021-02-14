<template>
  <div class="board-container">
    <div class="board">
      <div class="left-frame-container">
        <div v-for="r in rows" :key="r" class="left-frame">
          {{ r }}
        </div>
      </div>
      <div v-for="c in columns" :key="c" class="column">
        <div class="top-frame">{{ c }}</div>
        <div v-for="r in rows" :key="r" class="box">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      rows: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
    }
  }
}
</script>

<style lang="scss" scoped>
$board-size: 50px;
$top-frame-size: 20px;
$board-border-width: 1px;

.board-container {
  display: inline-block;
}
.board {
  display: flex;
  flex-direction: row-reverse;
}
.column:nth-child(2) .box {
  border-right: $board-border-width solid black;
}
.box {
  border-left: $board-border-width solid black;
  border-bottom: $board-border-width solid black;
  height: $board-size;
  width: $board-size;
}
.box:nth-child(2) {
  border-top: $board-border-width solid black;
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
</style>