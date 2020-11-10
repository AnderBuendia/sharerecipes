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
    extend: {},
  },
  variants: {},
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
}
