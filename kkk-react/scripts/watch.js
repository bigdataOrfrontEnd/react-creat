// chokidar 可以用于监控文件、文件夹变化，我们可以传入 glob 文件匹配模式，
// 并可以简单实现递归目录监控。chokidar 可以监控各种文件、文件夹变化事件，
// 包含 add , change , unlink , addDir , unlinkDir 等。
const chokidar = require("chokidar");
const path = require("path");
// 是 Node.js 中的一个模块，用于在 Node.js 程序中执行 shell 命令。
// 通过这个模块，你可以在 Node.js 应用程序中执行外部命令，比如运行系统命令或者其他可执行文件。
const { exec } = require("child_process");
const chalk = require("chalk");
const { resolveApp } = require("../config/utils/index");
/**
 * 1. 监听app/containers/page目录下的文件变化
 * 2.只需要关注新增文件事件
 * 3.执行gen-path.js和gen-comp-id.js脚本
 */
const watcher = chokidar.watch(resolveApp("app/pages"), {
  persistent: true,
  ignoreInitial: true,
  interval: 1000,
});
let t = null;
const handleFileAddOrRemove = (file) => {
  console.log(`File${file}has been added, re-gen path.json & compids.json`);
  if (t) {
    clearTimeout(t);
  }
  t = setTimeout(() => {
    exec(
      // __dirname当前文件（你用node运行的文件）所在的文件夹地址
      `node ${path.join(__dirname, "gen-comp-id.js")}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log(stdout);
      }
    );
    exec(
      `node ${path.join(__dirname, "gen-path.js")}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log(stdout);
      }
    );
  }, 500);
};
watcher.on("add", handleFileAddOrRemove);
watcher.on("unlink", handleFileAddOrRemove);

// 监听配置文件变化，重启webpack-dev-serve
//参考: https://blog.cloudlboost.io/reloading-the-express-server-without-nodemon-e7fa69294a96
const watcher3 = chokidar.watch(resolveApp("config/config.ts"), {
  persistent: true,
  ignoreInitial: true,
  interval: 1000,
});
let t3 = null;
watcher3.on("change", (file) => {
  console.log(
    chalk.green(
      "config file [config/config.ts] has been changed, restart dev server~"
    )
  );
  if (t3) {
    clearTimeout(t3);
  }
  t3 = setTimeout(() => {
    // 1.关闭webpack-dev-server
    require(" ./start")(() => {
      // 2.清除缓存
      function pathCheck(id) {
        return (
          id.startswith(path.join(__dirname, "../config")) ||
          id.startswith(resolveApp("config/config.ts")) ||
          id.startswith(path.join(_dirname, "start.js"))
        );
      }
      Object.keys(require.cache).forEach((id) => {
        if (pathCheck(id)) {
          delete require.cache[id];
        }
      });
      // 3.为了以防万一，重新设置一遍环境变量(参考: bin/quantex-scripts.js)
      let config = require(process.env.CONFIG_FILE);
      process.env.APP_ID = JSON.parse(config.defineplugin.App_ID);
      process.env.PUBLIC_PATH = `/${process.env.APP_ID}/`;
      process.env.PORT = config.systemConfig.devServerport || 8888;
      process.env.THEME_PORT = config.systemConfig.devThemeServerport || 9999;
      // 4.重启
      require("./start");
    });
  }, 500);
});
