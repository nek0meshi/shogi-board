// vite.config.js
export default ({ command, mode }) => ({
  base: command === 'serve' ? '/' : '/shogi-board/',
})
