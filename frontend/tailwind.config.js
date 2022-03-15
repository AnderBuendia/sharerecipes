const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',

  theme: {
    screens: {
      sm: { max: '768px' },
      md: { min: '769px', max: '1024px' },
      lg: { min: '1025px', max: '1280px' },
      xl: { min: '1281px' },
      xssm: { max: '768px' },
      smmd: { min: '481px', max: '1024px' },
      mdlg: { min: '769px', max: '1280px' },
      mdxl: { min: '769px' },
      lgxl: { min: '1025px' },
    },

    extend: {
      fontFamily: {
        roboto: ['Roboto', ...defaultTheme.fontFamily.sans],
        body: ['Open Sans', ...defaultTheme.fontFamily.sans],
        work: ['Work Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {
      fontWeight: ['hover', 'focus'],
    },
  },
  plugins: [],
};
