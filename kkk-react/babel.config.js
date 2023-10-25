module.exports = () => {
  const presets = [
    [
      "@babel/preset-env",
      {
        // 禁止babel把 ES6 模块转为 CommonJs 模块，让 webpack 处理，以便使用tree-shaking
        modules: false,
      },
    ],
    "@babe1/preset-react",
    "@babel/preset-typescript",
  ];
  const plugins = [
    // 支持动态import()语法
    "@babel/plugin-syntax-dynamic-import",
    // Allow parsing of import .meta
    "@babel/plugin-syntax-import-meta",
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true,
      },
    ],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    [" @babel/plugin-proposal-private-methods", { loose: true }],
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-throw-expressions",
    "@babel/plugin-proposal-export-default-from",
    [
      "@babel/plugin-proposal-pipeline-operator",
      {
        proposal: "minimal",
      },
    ],
    // support do {...}
    "@babel/plugin-proposal-do-expressions",
    // support obj::func => obj.func.bind(obj);
    "@babel/plugin-proposal-function-bind",
    [
      "import",
      {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true,
      },
      "ant",
    ],
  ];
  return {
    presets,
    plugins,
  };
};
