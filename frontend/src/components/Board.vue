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

<style scoped>
.board-container {
  display: inline-block;
}
.board {
  display: flex;
  flex-direction: row-reverse;
}
.column:nth-child(2) .box {
  border-right: 1px solid black;
}
.box {
  border-left: 1px solid black;
  border-bottom: 1px solid black;
  height: 50px;
  width: 50px;
}
.box:nth-child(2) {
  border-top: 1px solid black;
}
.top-frame {
  height: 20px;
}
.left-frame-container {
  width: 20px;
  padding-top: 20px;
}
.left-frame {
  height: 51px;
  line-height: 51px;
}
</style>