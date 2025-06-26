const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Clear resolver cache
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Reset cache on start
config.resetCache = true;

// Disable source maps temporarily to avoid anonymous file issues
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;