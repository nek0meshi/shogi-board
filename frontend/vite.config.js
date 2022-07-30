import vue from '@vitejs/plugin-vue'

export default ({ command }) => ({
  plugins: [vue()],
  base: command === 'serve' ? '/' : '/shogi-board/',
})
