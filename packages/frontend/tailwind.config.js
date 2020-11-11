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
      '30': '30%'
    },
    extend: {},
  },
  variants: {},
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
}
