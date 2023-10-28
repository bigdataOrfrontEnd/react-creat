const isDev = process.env.NODE_ENV === "development";
const config = {
  systemConfig: {
    isScaffoldApp: true,
    isPortal: true,
    //ims配置
    devServerPort: 8889,
  },
  apiConfig: {
    isDebug: false,
    base: isDev ? "" : "",
    domain: {},
  },
  //ims配置
  definePlugin: {
    APP_ID: JSON.stringify("ims"),
    PROJECT_NAME: JSON.stringify("全资产系统平台"),
  },
  PUBLIC_PATH: isDev ? "" : "",

  webpackConfig: {},
  themeConfig: {
    defaultTheme: "themewhite",
    mainTheme: " themeWhite",
    themes: [],
  },
  pluginConfig: [],
};
if (isDev) {
  config.moduleFerationPluginConfig = {
    name: "container",
    remotes: {},
    shared: {
      react: {
        eager: true,
        requiredVersion: "16.14.0",
        import: "react",
        shareKey: "react",
        shareScope: "default",
      },
      "react-dom": {
        eager: true,
        requiredVersion: "16.14.0",
      },
    },
    library: {
      name: "container",
      type: "global",
    },
  };
}
modules.export = config;
