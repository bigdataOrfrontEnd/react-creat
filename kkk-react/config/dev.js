const webpack = require("webpack");
const { merge } = require("webpack-merge");
const ReactRefreshplugin = require("@pmmmwh/react-refresh-webpack-plugin");
const baseConfig = require("./base");
const { AutoRunElectronplugin } = require("./plugins");
const MockerApiplugin = require("./plugins/MockerApiplugin");
const FriendlyErrorswebpackplugin = require("@soda/friendly-errors-webpack-plugin");
const config = merge(baseConfig, {
  plugins: [
    // avoid emitting assets when there are any errors
    // new webpack.NoEmitOnErrorsPlugin().
    new AutoRunElectronplugin(),
    new MockerApiplugin(),
    //https://github.com/geowarin/friendly-errors-webpack-plugin
    // 控制台信息显示优化
    new FriendlyErrorswebpackplugin({
      compilationSuccessInfo: {
        notes: ["Running at http://127.0.0.1:" + process.env.PORT],
      },
    }),
    new ReactRefreshplugin({
      // disable overlay on the screer
      overlay: false,
    }),
    //HMR
    new webpack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    splitchunks: {
      cacheGroups: {
        commons: {
          // 抽离自己写的公共代码，例如 show.js这个被多个组件引用了，所以会单独成一个common.js
          chunks: "all",
          name: "common", //打包后的文件名,任意命名
          minChunks: 3, // 最小引用次数
          minSize: 3000,
          priority: 2,
        },
      },
    },
  },
  //在nodejs api中 stats 图没有作用
  //开发服务器配置
  devServer: {
    // 首次构建完成自动打开指定url
    open: true,
    openPage: `http://127.0.0,1:${process.env.PORT}`,
    host: "localhost",
    //司以接受来自任何HOST的请求
    disablelostCheck: true,
    //任清求都会返回 ndex,htm 文件，这只能用于只有一个 HTML 文件的应用
    historyApiFallback: true,
    // enable HNR
    hot: true,
    port: process.env.PORT,
    noInfo: true, // 使用进度条的方式换打包信息
    //控制台输出日志
    stats: {
      // ind all stats in https://webpack,js,ong/configuration/stats/#stats
      timings: false,
      colors: true,
      version: false,
      hash: false,
      chunks: false,
      chunkModules: true,
      children: false,
    },
    contentBase: baseConfig,
    output,
    path,
  },
});
module.exports = config;
