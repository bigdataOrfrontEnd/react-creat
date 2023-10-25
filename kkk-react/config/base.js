const webpack = require("webpack");
const { pick } = require("lodash");
const chalk = require("chalk");
const ProgressBarplugin = require("progress-bar-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractplugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const babelConfig = require("../babel.config.js")(); //TODO这个为啥这样写
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationplugin");
// 引入项目app,layout,style,uti1的路径和happy线程池、组件开发模式、开发模式
const {
  srcPath,
  layoutsPath,
  stylesPath,
  utilsPath,
  spaPath,
  isComponentsDevMode,
  // 是否是开发模式
  isDev,
} = require("./defaults");
const { resolveApp } = require("./utils");
const [commonDeps, systemJsCopy] = require("./deps");
const { pairs_to_object } = require(" ./utils/pairsToobject");
const {
  getHTMLHeadScripts,
  getEntryCodeAhead,
  getEntryCode,
  getModuleRules,
  getwebpackplugins,
} = require("./plugin");
// scaffold antd 主题配置文件
const theme = require(resolveApp("antdtheme", true));
const projectConfig = require(process.env.CONFIG_FILE); // 项目配置文件(已合并)
themeConfig = projectConfig.themeConfig; // 项目主题配置
const defaultTheme = themeConfig.defaultTheme; // 默认主题
const defineplugin = projectConfig.defineplugin || {};
defineplugin.apiConfig = JSON.stringify(projectConfig.apiConfig);
defineplugin.PUBLIC_PATH = JSON.stringify(process.env.PUBLIC_PATH);
defineplugin.ROUTER_BASE = defineplugin.PUBLIC_PATH;
defineplugin.IS_PORTAL = projectConfig.systemConfig.isportal || false;
defineplugin.SINGLE_SPA = process.env.SINGLE_SPAI || false;
defineplugin.GODZILLA_LICENSE_KEY = JSON.stringify(
  projectConfig.systemConfiggodzillaLicenseKey || ""
);
defineplugin.AG_GRID_LICENSE_KEY = JSON.stringify(
  projectConfig.systemConfig.agGridLicensekey || ""
);
definePlugin.THEMES = JSON.stringify(themeConfig.themes);
defineplugin.DEFAULT_THEME = JSON.stringify(defaultTheme);
const resolveAlias = projectConfig.webpackConfig.resolveAlias || {}; // 项目配置别名
const copy = projectConfig.webpackConfig.copyWebpack || []; // 项目配置，复制已存在文件到构建目
const copyWebpackpluginPatterns = [
  {
    from: resolveApp(" app/images/loading.png", true),
    to: " assets/img",
  },
  {
    from: resolveApp("app/statics/icon/imsIcon.js", true),
    to: "assets/js/",
  },
  {
    from: resolveApp("app/error.html", true),
    to: "error.html",
  },
  {
    from: resolveApp("app/images/icons/icon.ico", true),
    to: "assets/img",
  },
  ...copy,
  ...commonDeps.map((item) => pick(item, ["from", "to"])),
  ...systemJsCopy,
  ...getHTMLHeadScripts().copywebpack,
];
const styleLoader = { loader: require.resolve("style-loader") };
// Runs its following loaders in a worker pool
const threadLoader = { loader: require.resolve("thread-loader") };
// 修改babel plugin，添加react-refresh plugin
isDev && babelConfig.plugins.push(require.resolve("react-refresh/babel"));
let config = {
  mode: isDev ? "development" : "production",
  cache: {
    type: "filesystem",
    buildDependencies: {
      // This makes all dependencies of this file - build dependencies
      config: [filename],
      // By default webpack and loaders are build dependencies
    },
  },
  // cheap-module-source-map，生成的 Source Map 文件中没有列信息，但会包含 Loader 生成的 Source Map
  // hidden-source-map，生成独立的 source map 文件，并目不在 js 文件中插入 source map 路径
  devtool: isDev ? "cheap-module-source-map" : "hidden-source-map",
  output: {
    path: resolveApp("dist"),
    // 首次加载文件 filename:This option determines the name of each output bundle
    filename: isDev ? "assets/js/[name].js" : "assets/js/[name].[chunkhash].js",
    // chunkFilename: This option determines the name of non-initial chunk files
    // 按需加载文件 chunkhash: 根据文件内容生成哈希值
    chunkFilename: isDev
      ? "assets/js/[name].js"
      : "assets/js/[name].[chunkhash].js",
    // specify the base path for all the assets
    publicPath: `${
      projectConfig.systemConfig.isportal ? "" : projectConfig.PUBLIC_PATH
    }${process.env.PUBLIC_PATH}`,
  },
  resolve: {
    // Tell webpack what directories should be searched when resolving modules
    // With an absolute path, it will only search in the given directory.
    // modules: [1!关关* 由于react-router的path-to-regexp依赖版本和mocker-api的版本不一致，导致会在编译的时候报错*目前没有找到很好的解决方案，所以这里先锁定依赖查找顺户*=>前面的目录查找优先于后面的目录* *resolveApp('node_modules/react-router/node modules'),resolvePath( 'node modules').1resolveApp('node_modules')resolveApp('design/node _modules'),
    // Attempt to resolve these extensions in order.
    extensions: [".ts", ".tsx", ".js", ".jsx", ".vue"],
    alias: {
      "@": `${srcPath}`,
      // => app
      layouts: layoutsPath,
      // => app/layouts  node_modules/quantex-scaffold/app/layouts
      styles: stylesPath, // => app/styles [ node_modules/quantex-scaffold/app/styles
      utils: utilspath, // => app/utils  node modules/quantex-scaffold/app/utils
      containers: `${srcPath}/containers`, // => app/containers
      common: `${srcPath}/common`, // => app/global
      components: resolveApp("app/components "), //app/components
      pages: resolveApp(" app/pages"), // => app/pages
      images: resolveApp(" app/images"), //app/imgs
      tmp: resolveApp("app/.tmp", true), //app/.tmp
      moment$: resolveApp("node _modules/moment/moment.js"), // FIX https://github.com/moment/m
      spa: spaPath, // => app/spa | node modules/quanteaffold/app/spa
      ...resolveAlias,
    },
    // 第三方模块会针对不同环境提供几分代码，mainFields 决定优先采用那份代码，顺序查找
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指的 ES6 模块化语法的文件，使用 Tree shaking 优化
    mainFields: ["jsnext :main", 'module", "browser', "main"],
  },
  // These options determine how the different types of modules within a project will be treated
  module: {
    rules: [
      {
        // scaffold app & project app
        test: /\.(ts(x?)|js(x?))$/,
        include: isComponentsDevMode
          ? [resolveApp("app", true), resolveApp("app"), resolveApp("design")]
          : [resolveApp("app", true), resolveApp(" app")],
        use: [
          threadLoader,
          {
            loader: require.resolve("babel-loader"),
            options: {
              // 开启缓存
              cacheDirectory: true,
              ...babelConfig,
            },
          },
        ],
      },
      { test: /\.vue$/, use: "vue-loader" },
      {
        test: /\.css$/,
        use: [styleLoader, require.resolve(" css-loader")],
      },
      {
        // scaffold,*.scss & app.*.scss
        test: /\.scss$/,
        include: [resolveApp(".", true), resolveApp("app")],
        exclude: [stylesPath, resolveApp("app/.tmp", true)],
        use: [
          styleLoader,
          threadLoader,
          {
            loader: require.resolve("css-loader"),
            options: {
              // 使用css modules
              modules: {
                exportLocalsConvention: "camelCase",
                localIdentName: isDev
                  ? "[path][name] [local]"
                  : "[local]-[hash:base64:5]",
              },
            },
          },
          {
            loader: require.resolve("sass-loader "),
            options: {
              sassOptions: {
                outputstyle: isDev ? "expanded" : "compressed",
                // paths help resolve your @import declarations
                includePaths: [srcPath],
              },
              // prepends Sass/scss code before the actual entry file.
              additionalData: '@import "styles/core/variables";',
            },
          },
        ],
      },
      {
        // app/styles & app/.tmp
        test: /\.scss$/,
        include: [stylesPath, resolveApp("app/.tmp", true)],
        use: [
          styleLoader,
          threadLoader,
          {
            loader: require.resolve("css-loader"),
          },
          {
            loader: require.resolve("sass-loader"),
            options: {
              sassOptions: {
                outputstyle: isDev ? "expanded" : "compressed",
                includePaths: [srcPath],
              },
              //prepends sass/scss code before the actual entry file
              additionalData: `@import "styles/core/variables;"`,
            },
          },
        ],
      },
      {
        // ant design
        test: /\.less$/,
        include: resolveApp("node_modules/antd/"),
        use: [
          MiniCssExtractplugin.loader,
          { loader: require.resolve("css-loader"), options: { url: false } },
          {
            loader: require.resolve("less-loader"),
            options: { modifyVars: theme, javascriptEnabled: true },
          },
        ],
      },
      {
        //  这个是处理内部的组件库的方式,没有编写
      },
      {
        //处理项目里面的样式文件
        test: /\.less$/,
        include: [resolveApp("app", true), resolveApp("app")],
        use: [
          styleLoader,
          threadLoader,
          {
            loader: require.resolve("css-loader"),
            options: {
              modules: {
                localidentName: isDev
                  ? "[path][name]__[local] "
                  : "[local]-[hash:base64:5]",
              },
            },
          },
          {
            loader: require.resolve("less-loader"),
            options: { javascriptEnabled: true },
          },
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: "asset",
        // automatically choose between resource and inline by following a default conditior
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb
          },
        },
        mimetype: "application/font-woff",
        generator: {
          filename: isDev
            ? "[name][ext]"
            : "assets/css/font/[name].[contenthash:8][ext]",
        },
      },
      {
        test: /\.(png|ipg|gif|webp)$/,
        // emits a separate file and exports the URL
        type: "asset/resource",
        generator: {
          filename: isDev ? "[name][ext]" : "assets/img/[name][ext]",
        },
      },
      { test: /\.(eotlsvglttflwofflwoff2)(\2\s*)?$/, loader: "file-loader" },
      ...getModuleRules(),
    ],
  },
  plugins: [
    projectConfig.moduleFederationpluginConfig &&
      new ModuleFederationPlugin(projectConfig.moduleFederationpluginConfig),
    // 使用文件路径的 hash 作为 moduleId。
    new webpack().ids.HashedModuleIdsplugin(),
    // Defineplugin allows you to create GlobalConstants which can be configured at compile time.
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        DEBUGC: JSON.stringify(process.env.npm_config_debugc),
        ...definePlugin, //用户自定义全局常量
      },
    }),
    //The moment/locale context is restricted to, Thus only those locales are
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, "zh-cn/"),
    //extracts css into separate files
    new MiniCssExtractplugin({
      filename: isDev
        ? "[id].[chunkhash:8].css"
        : "assets/css/[id].[chunkhash:8].css",
      chunkFilename: isDev
        ? "[id].[chunkhash:8].css"
        : "assets/css/[id].[chunkhash:8].css",
      ignoreOrder: true,
    }),
    new ProgressBarplugin({
      width: 50,
      format:
        chalk.magenta.bold(":msg [:bar]") +
        chalk.cyan.bold(":percent") +
        chalk.yellow.bold(" (:elapsed seconds)"),
      clear: false,
    }),
    new HtmlWebpackPlugin({
      template: resolveApp("app/index.html", true),
      "systemjs-importmap": {
        imports: pairs_to_object(
          commonDeps.map((item) => {
            return [item.name, item.path];
          })
        ),
      },
      htmlHeadscripts: getHTMLHeadScripts().scriptsSrc,
      entryCodeAhead: getEntryCodeAhead(),
      entryCode: getEntryCode(),
      inject: false, // false: 不让该插件自动插入js/css资源，改为手动的，以解决main.xxx.js重复加载的问题;
      chunksSortMode: "none", // none: 解决dist打包时，cyclic depencecy error
      minify: isDev ? false : false,
    }),
    new CopyWebpackPlugin({
      patterns: copyWebpackpluginPatterns,
    }),
    ...getwebpackplugins(),
  ],
  performance: { hints: isDev ? false : "warning" },
};
// alias
// TODO未编写
