module.exports = {
  theme: {
    extend: {
      colors: {
        cyan: '#9cdbff',
      }
    }
  },
  variants: {},
  plugins: [
    require('flowbite/plugin')
  ],
  content: [
    "./node_modules/flowbite/**/*.js"
  ]
}
