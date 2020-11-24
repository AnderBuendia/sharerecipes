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
      '20': '20%',
      '30': '30%'
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
