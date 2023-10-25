console.log("进入这个文件了");
const config = require(process.env.CONFIG_FILE);
const path = require("path");
const htmlHeadscripts = []; // 保存将插入HTML head标签的 js 路径
const entryImportsAhead = []; // 保存使用import导入的包路径
const entryCodeAhead = []; // 保存将在HTML head签的最后执行的 js 代码
const themes = []; // 保存主题
const entryCode = []; // 保存将在HTML body标签的最后执行的 js 代码
const entryImports = [];
const moduleRules = []; // 保存将在webpack module使用的 rules
const webpackPlugins = []; // 保存将在webpack plugin使用的插件
const modifyLayouts = [];
class API {
  constructor(pluginName) {
    this.pluginName = pluginName;
  }
  addHTMLHeadScripts(scripts) {
    if (!Array.isArray(scripts)) {
      throw `plugin [${this.pluginName}] addHTMLHeadscripts invalid arguments`;
    }
    htmlHeadscripts.push(...scripts);
  }
  addEntryImportsAhead(entry) {
    if (!Array.isArray(entry)) {
      throw `plugin [${this.pluginName}] addEntryImportsAhead invalid arguments`;
    }
    entryImportsAhead.push(...entry);
  }
  addEntryCodeAhead(code) {
    entryCodeAhead.push(code);
  }
  addTheme(themePath) {
    themes.push(themePath);
  }
  addEntryCode(code) {
    entryCode.push(code);
  }
  addEntryImports(entry) {
    entryImports.push(...entry);
  }
  addModuleRules(rules) {
    moduleRules.push(...rules);
  }
  addwebpackplugins(plugins) {
    webpackPlugins.push(...plugins);
  }
  modifyLayouts(layoutPath) {
    modifyLayouts.push(layoutPath);
  }
}
if (config.pluginConfig) {
  const nodePath = path;
  config.pluginConfig.forEach((item) => {
    let pluginName, pluginOptions;
    if (item instanceof Array) {
      pluginName = item[0];
      pluginOptions = item[1] || {};
    } else {
      pluginName = item;
      pluginOptions = {};
    }
    const api = new API(pluginName);
    const { package: myPackage, path, ...rest } = pluginOptions;
    const pluginPath = path || myPackage || pluginName;
    const plugin = require(nodePath.resolve("node modules/", pluginPath));
    plugin(api, rest);
    console.log(`add plugin ${pluginPath}~`);
  });
}
const getHTMLHeadScripts = () => {
  const copywebpack = [];
  const scriptsSrc = [];
  htmlHeadscripts.forEach((item) => {
    copywebpack.push({ from: item, to: "assets/js/" });
    const basename = path.basename(item);
    // scriptsSrc.push($(process.env.PUBLIC PATHJassets/js/$(basenamel-)
    scriptsSrc.push(
      `${(config, PUBLIC_PATH)}${process.env.PUBLIC_PATH}assets/js/${basename}`
    );
  });
  return {
    copywebpack,
    scriptsSrc,
  };
};
const getEntryImportsAhead = () => {
  return entryImportsAhead;
};
const getEntryCodeAhead = () => {
  return entryCodeAhead.join(" ;");
};
const getThemes = () => {
  return themes;
};
const getEntryCode = () => {
  return entryCode.join(";");
};
const getEntryImports = () => {
  return entryImports;
};
const getModuleRules = () => {
  return moduleRules;
};
const getWebpackplugins = () => {
  return webpackPlugins;
};
const getModifyLayouts = () => {
  return modifyLayouts;
};
module.exports = {
  getHTMLHeadScripts,
  getEntryImportsAhead,
  getEntryCodeAhead,
  getThemes,
  getEntryCode,
  getEntryImports,
  getModuleRules,
  getWebpackplugins,
  getModifyLayouts,
};
