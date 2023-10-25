const fs = require("fs");
const { resolveApp } = require("../config/utils");
const { getEntryImports } = require("../config/plugin");

//在入口文件现有 import 的后面添加 import
fs.writeFileSync(
  resolveApp("app/.tmp/addEntryImports.js", true),
  getEntryImports()
    .map((item) => `import ${item}";"`)
    .join("\t") + "\n};"
);
