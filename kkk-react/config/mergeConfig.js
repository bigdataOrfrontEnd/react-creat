/**
 * 文件作用: 这个文件主要是将项目中的配置文件进行合并
 * 
 * /
// path.resolve([…paths])里的每个参数都类似在当前目录执行一个cd操作
/**fs.existssync
 * 以同步的方法检测目录是否存在。

　　如果目录存在 返回 true ，如果目录不存在 返回false
 */

const path = require("path");
const fs = require("fs");
const { merge, cloneDeep } = require("lodash");
//合并项目中的config.default.ts和config.ts配置文件
// 备注:这是一个立即执行文件
module.exports = (function () {
  let config;
  let defaultConfig;
  try {
    /*
    正式环境，所有的静态资源都要经过bff来转发，
    所以得有个前缀来区分不同的子应用目前以appId作为前缀，
    在bff可以根据这个前缀找到对应的应用信息，
    从而转发到子应用获取静态资源,
    所以，暂时这publicPath不能让用户指定，包括base_router
    **/
    //path.resolve如果没有传入 path 片段，则返回当前工作目录的绝对路径;
    //configPath:D:\workspace\cli-view\config/config
    const configPath = path.resolve("config/config");
    console.log("222configPath", configPath); //D:\workspace\cli-view\config\config
    let defaultConfigPath = path.resolve("app/config.default.js");
    console.log("221defaultConfigPath", defaultConfigPath);
    if (
      // existsSync以同步的方法检测目录是否存在。如果目录存在 返回 true ，如果目录不存在 返回false
      fs.existsSync(configPath + ".ts") ||
      fs.existsSync(configPath + ".js")
    ) {
      config = require(configPath);
      if (!fs.existsSync(defaultConfigPath)) {
        console.log(
          "如果项目中没有app/config.default.js,就会使用scaffold中的文件"
        );
        //把全部给定的path片段连接到一起，并规范化生成的路径
        defaultConfigPath = path.resolve(
          // `node_modules/${config.systemConfig.npmscope}/quantex-scaffold`, //TODO这个部署的时候再添加
          "app/config.default.ts"
        );
      }
      defaultConfig = require(defaultConfigPath);
      console.log("加载默认配置,也就是app/config.default.js");
      config = merge(cloneDeep(defaultConfig), config);
    } else {
      console.log(`${configPath}文件不存在`);
      // 当没有更多异步操作挂起时，节点通常以 0 状态码退出
      process.exit(0);
    }
  } catch (e) {
    console.log(e);
  }
  return config;
})();
