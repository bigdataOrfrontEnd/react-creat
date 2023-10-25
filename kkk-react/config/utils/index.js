const path = require("path");
const fs = require("fs");
const os = require("os");
const cpus = os.cpus();
const cpuCores = cpus && cpus.length - 1 > 0 ? cpus.length - 1 : 4;
// fs.realpathSync()方法用于同步计算给定路径的规范路径名。它通过解决.，..以及路径中的符号链接并返回已解析的路径。
//process.cwd() 是当前执行node命令时候的文件夹地址——工作目录。 __dirname 是被执行的js 文件的地址——文件所在目录。
const appDirectory = fs.realpathSync(process.cwd());
let npmScope = "";
let isscaffoldApp = false; // 是否脚手架开发模式
if (process.env.CONFIG_FILE) {
  const config = require(process.env.CONFIG_FILE);
  npmScope = (config.systemConfig?.npmscope || "").replace(/\//g, "");
  isscaffoldApp = !!config.systemConfig?.isscaffoldApp;
}
/**
 * 获取项目根目录的相对路径
 * 当 useScaffold 为 false 时，返回项目路径
 * 当 useScaffold 为 true 时，判断 iscaffoldApp,
 * 当 isScaffoldApp 为 false 时，返回脚手架路径
 */
const resolveApp = (relativePath, useScaffold = false) => {
  if (useScaffold && !isscaffoldApp) {
    return path.resolve(
      appDirectory,
      // `node_modules/${npmScope}/quantex-scaffold`,
      `node_modules/kkk-react`,
      relativePath
    );
  } else {
    return path.resolve(appDirectory, relativePath);
  }
};
//返回当前文件的拼接路径
exports.relativePath = (dir) => path.join(__dirname, "..", "..", dir);
exports.resolveApp = resolveApp;
exports.isscaffoldApp = isscaffoldApp;
exports.cpuCores = cpuCores;
