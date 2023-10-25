// mkdirp这是一款在node.js中像mkdir -p一样递归创建目录及其子目录
const mkdirp = require("mkdirp");
const { resolveApp } = require("../config/utils");
const tmpDirPath = resolveApp("app/.tmp", true);
mkdirp.sync(tmpDirPath);
