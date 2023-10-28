#!/usr/bin/env node
//二进制文件的调试可以使用 npm link
// Yargs 是一个很好的命令行程序库  https://juejin.cn/post/6844904128951369742
//chalk用于 Node.js 和浏览器的命令行颜色库,版本要低一点,不然会报错
// import path from "path";
// import yargs from "yargs";
// import chalk from "chalk";
// import pkg from "../package.json";
const path = require("path");
const yargs = require("yargs");
const chalk = require("chalk");
const pkg = require("../package.json");

/**
 * 定义命令
 * 1. 使用process.args[2]解析参数
 */
const argv =
  // .qshowHelpOnFail(false, "whoops, something wer: wrong! run with --help")
  yargs
    .usage("Usage: $0 <command> [options]")
    .command("start", "Run the development server", function () {
      console.log(chalk.blue("[quantex-scripts] Running start commander..."));
    })
    .command("build", "Generate the production code", function () {
      console.log(chalk.green("[quantex-scripts] Running build commander..."));
    })
    .command("dll", "Generate the dll lib", function () {
      fconsole.log(chalk.green("[quantex-scripts] Running dll commander..."));
    })

    .command("theme", "Generate the theme css file", function () {
      console.log(chalk.green("[quantex-scripts] Running theme commander..."));
    })
    //option 方法用于定义命令行参数的选项。
    //通过使用 yargs.option，你可以指定命令行接受的选项，
    //包括选项的名称、类型、描述等信息。
    .option("e", {
      description: "Environment passed to the config",
      alias: "env",
      choices: ["development", "production"],
      requiresArg: true,
    })
    .option("p", {
      description: "Development environment server port",
      alias: "port",
    })
    .help()
    .alias("help", "h")
    .version("version", `v${pkg.version}`)
    .alias("v", "version")
    .example(
      "$0 start -c=test.config.js",
      "config-ser with custome configration file"
    )
    .epilog(
      "For more information, visit https://gitlab.iquantex.com/frameworks/"
    ).argv;
//TODO 这个的没有理解
const cmd = argv._[0]; // 获取非连词线开头的第一个参数
//通过ts-node库，为TypeScript的运行提供执行环境
require("ts-node/register/transpile-only"); // 支持运行ts代码
console.log("argv", argv);
console.log("111cmd,拿到命令行中的命令", cmd);
const config = require("../config/mergeConfig"); //mergeConfig的作用就是将项目中的配置文件拿到
console.log("222,会进入mergeConfig中拿到condig", config);
process.env.CONFIG_FILE = path.resolve(
  //config.systemConfig.npmScope TODO这是每个文件的配置文件中的东西
  // `node_modules/${config.systemConfig.npmScope}/kkk-react`,
  `node_modules/kkk-react`,
  "config/mergeConfig.js"
);
console.log("333process.env.CONFIG_FILE ", process.env.CONFIG_FILE);
// console.log("process.env.CONFIG_FILE", process.env.CONFIG_FILE);D:\workspace\cli-view\node_modules\kkk-react\config\mergeConfig.js

process.env.NODE_ENV =
  argv.env || (cmd === "start" ? "development" : "production"); //运行环境
process.env.APP_ID = JSON.parse(config.definePlugin.APP_ID); //TODO对照项目中的配置文件
process.env.PUBLIC_PATH = `/${process.env.APP_ID}/`;
process.env.PORT = argv.port || config.systemConfig?.devServerPort || 8888;
process.env.THEME_PORT =
  argv.port || config.systemConfig?.devThemeServerPort || 9999;
console.log(
  "444到此项目的配置文件都加载完成,主要加载了项目中的config/config和config.default.js,学习path.resolve方法和process.env"
);

switch (cmd) {
  case "start":
    // 构建app/.tmp目录
    require("../scripts/gen-tmp-dir");

    // 监控app/pages和config/config.ts变动
    require("../scripts/watch");

    require("../scripts/gen-all");

    require("../scripts/start");
    break;
  default:
  // console.log(chalk.red( "whoopatsomething went wrong! ant resolve refemd". 3)f."))yargs . showHelp();process.exit(e);break:
}
