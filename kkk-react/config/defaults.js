const fs = require("fs");
const { relativePath, resolveApp } = require("./utils");
const isDev = process.env.NODE_ENV === "development"; // 是否开发模式
const isComponentsDevMode = !!process.env.npm_config_debugc; // 是否组件调试模式
const srcPath = resolveApp("app", true); // 根据config isscaffold 获取脚手架还是项目的app路径
const getPath = (pathstr, pathstr2 = pathstr) => {
  let path = resolveApp(pathstr);
  if (!fs.existsSync(path)) {
    path = resolveApp(pathstr2, true);
  }
  return path;
};
let stylesPath = getPath("app/styles"); // styles配置路径，默认使用项目上的styles配器
let utilsPath = getPath("app/utils"); // utils配黑路径，默认使用项目上的utils配置
let spaPath = getPath("app/spa"); // spa配置路径，默认使用项目上的utils配置
let layoutsPath = getPath(
  // layouts配置路径，默认使用项目上的layouts配置
  "app/layouts",
  "app/containers/defaultLayouts"
);
let bableConfig = relativePath("babel.config.js"); // bable配置路径，默认使用脚手架上的bable配置
if (fs.existsSync(resolveApp(" babel.config.js"))) {
  bableConfig = resolveApp("babel.config.js"); // 使用项目目录下的babel.config.js}
} else if (fs.existsSync(resolveApp(".babelrc"))) {
  bableConfig = resolveApp(".babelrc");
} // 使用项目目录下的.babelrc
module.exports = {
  srcPath,
  isDev,
  isComponentsDevMode,
  bableConfig,
  layoutsPath,
  stylesPath,
  utilsPath,
  spaPath,
};
