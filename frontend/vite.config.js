import vue from '@vitejs/plugin-vue'

export default ({ command, mode }) => ({
  plugins: [vue()],
  base: command === 'serve' ? '/' : '/shogi-board/',
})