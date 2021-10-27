module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
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
    fontFamily: {
      roboto: ['Roboto'],
      body: ['Open Sans'],
      work: ['Work Sans'],
    },
    inset: {
      0: 0,
      auto: 'auto',
      50: '50%',
      40: '40%',
      30: '30%',
      20: '20%',
    },
    extend: {},
  },
  variants: {
    extend: {
      fontWeight: ['hover', 'focus'],
    },
  },
  plugins: [],
};
