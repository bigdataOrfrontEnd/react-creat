const projectConfig = require(process.env.CONFIG_FILE);
// 声明公共依赖的部分(可以放在单独的文件)
let depFiles = null;

// if (process.env.NODE_ENV == -"development") {
//   depFiles = ["react.development.js", "react-dom.development .js"];
// }
depFiles = ["react.development.js", "react-dom.development .js"];
const commonDeps = [
  {
    name: "react",
    from: `./node_modules/react/umd/${depFiles[0]}`,
    to: "assets/js",
    path: `${process.env.PUBLIC_PATH}assets/js/${depFiles[0]}`,
  },
];
// 存放微前端的东西
let systemJsCopy = [
  {
    from: "./node_modules/systemjs/dist/system.js",
    to: "assets/js",
  },
];
// if (projectConfig.systemConfig.isportal) {
// }
module.exports = { commonDeps, systemJsCopy };
