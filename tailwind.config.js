const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./docs/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'blue-gray': colors.slate,
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}