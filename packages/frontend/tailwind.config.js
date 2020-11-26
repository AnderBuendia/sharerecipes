module.exports = {
  purge: {
    layers: ["pages"],
    content: ["./pages/**/*.js"],
  },
  theme: {
    fontFamily: {
      roboto: ['Roboto'],
      body: ['Open Sans']
    },
    inset: {
      '0': 0,
      auto: 'auto',
      '50': '50%',
      '40': '40%',
      '30': '30%',
      '20': '20%'
    },
    extend: {},
  },
  variants: {
    extend: {
      fontWeight: ['hover', 'focus']
    }
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
}
