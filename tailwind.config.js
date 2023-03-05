const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.md',
    './src/**/*.liquid',
    './node_modules/flowbite/**/*.js',
    './katameros-preparation/utils/article-helpers.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/typography'), require('flowbite/plugin')],
};
