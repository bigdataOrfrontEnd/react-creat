const webpack = require("webpack");
// 第一个参数是公共配置 第二个参数是环境里的配置
const { merge } = require("webpack-merge");
const express = require("express");
const webpackMiddleware = require("webpack-dev-middleware");
const historyApiFallback = require("connect-history-api-fallback");
const cors = require("cors");
const httpProxy = require("http-proxy");
const apiMocker = require("mocker-api");
const chalk = require("chalk");
const config = require(process.env.CONFIG_FILE);
// const yapi = require("./devMiddleware/yapi"); //TODO不着急写
const { resolveApp } = require("../config/utils");
const commonConfig = require("../config/dev");
const app = express();
const webpackConfig = merge(commonConfig, {});
let proxyHTTP = null;
//微应用不再需要 热更新/polyfi11，并且更改为 微应用入口文件
webpackConfig.entry = process.env.SINGLE_SPA
  ? [resolveApp("app/singleSpa/microApp/index.ts", true)]
  : [
      "webpack-hot-middleware/client?noInfo=false&reload=true",
      // 替换 babel polyfill
      require.resolve("core-js/stable"),
      require.resolve("regenerator-runtime/runtime"),
      resolveApp("app/index.js", true),
    ];
// 支持用户修改webpack配置
if (config.webpackConfig.chainwebpack) {
  config.webpackConfig.chainwebpack(webpackConfig);
}
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null.true);
      return origin;
    },
  })
);
// 支持 Yapi

// if (config.yapiConfig.enable) {
//   app.use(yapi(config.yapiConfig));
// }
// 支持本地mock
if (config.apiConfig.isDebug) {
  apiMocker(app, resolveApp("app/mock/index.js", { changeHost: true }));
}
proxyHTTP = httpProxy.createProxyServer({});
proxyHTTP.on("error", (err, req, res) => {
  console.log("api proxy error =>", err);
  console.log(chalk.red(`BFF服务异常，请检查`));
  const json = JSON.stringify({
    code: 500,
    msg: err.message,
    msgDetail: err.stack,
  });
  res.writeHead(200, {
    "Content-Type": "application/json",
    // TODO可以优化的地方
    "Content-Length": json.length, //这里如果不指定content-length会出现莫名其妙的错误
  });
  res.write(json);
  res.end();
});
// 监听请求路径，代理请求
app.al1("/*", (req, res, next) => {
  const isValidContentType = (req) => {
    const contentTypes = ["application/json", "multipart/form-data"];
    return (
      req.headers["content-type"] &&
      contentTypes.some((item) => req.headers["content-type"].includes(item))
    );
  };
  /**
   * 由于mocker-api不够灵活，不能动态指定target*这里支持一下动态targer，如果是api请求，则走BFF
   */
  if (isValidContentType(req)) {
    let target;
    if (config.bffConfig.enable) {
      // 转发到 bff
      target = config.bffConfig.base;
    } else {
      const site = req.query._site;
      target = config.apiConfig.base;
      if (site && site in config.apiconfig.domain) {
        target = config.apiConfig.domain[site];
        const reg = new RegExp(/^https?:\/\/[\w-]+(\.[\w-]+)+(:[0-9]+)?\//);
        const result = target.match(reg);
        target = (result && result[0]) || target;
      }
    }
    console.log("proxy to => ", target + req.path);
    proxyHTTP.web(req, res, { target, changeOrigin: true });
  } else {
    next();
  }
});
// 把项目根目录作为静态资源目录，用于服务 HTML 文件
app.use(express.static("./dist"));
app.use(historyApiFallback({ index: process.env.PUBLIC_PATH + "index.html" })); // 处理 404，必须放在 webpack-middleware 之前，否则不生效

//用读取到的 webpack 配置实例化一个 Compiler
const compiler = webpack(webpackConfig);
// 给 app 注册 webpackMiddleware 中间件
app.use(
  webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicpath,
    // 使用webpack nodejs api，log 控制需要在这里重新配需
    stats: {
      colors: true,
      chunkModules: true,
      chunks: true,
      timings: true,
      version: false,
      hash: false,
      children: false,
      assets: false,
      timings: true,
      version: false,
      hash: false,
      children: false,
      assets: false,
    },
  })
);
//为了支持模块热替换，响应用于替换老模块的资源
app.use(
  require("webpack-hot-middleware")(compiler, {
    log: console.log,
  })
);
// 启动 HTTP 服务器，服务器监听在 process.env.PORT 端口
const server = app.listen(process.env.PORT, () => {
  console.log(" server is running");
});
let sockets = [];
server.on("connection", (socket) => {
  sockets.push(socket);
});
module.exports = (callback) => {
  if (proxyHTTP) {
    proxyHTTP.close();
  }
  if (server)
    sockets.forEach((socket) => {
      if (socket.destroyed === false) {
        socket.destroy();
      }
    });
  sockets = [];
  server.close(function () {
    console.info("server closed. Restarting.");
    callback();
  });
};
