const withTM = require('next-transpile-modules')(['three/examples/jsm/postprocessing/UnrealBloomPass']);

module.exports = withTM({
  typescript: {
    ignoreBuildErrors: true,
  },
});