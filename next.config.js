module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    config.module.rules.push({
      test: /UnrealBloomPass\.js$/,
      use: 'raw-loader',
    });

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
