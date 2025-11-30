module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
      // "babel-preset-expo",
    ],
    plugins: ['react-native-paper/babel','react-native-worklets/plugin']
  };
};