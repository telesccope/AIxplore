const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
console.log(defaultConfig);  // 打印默认配置

const config = {};

module.exports = mergeConfig(defaultConfig, config);
