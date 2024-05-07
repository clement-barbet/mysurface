module.exports = {
<<<<<<< HEAD
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
=======
>>>>>>> 7e68b56 ("Imported UnrealBloomPass" from CDN)
  typescript: {
    ignoreBuildErrors: true,
  },
};
