const fs = require("fs");
const { getModifyLayouts } = require("../config/plugin");
const { resolveApp } = require("../config/utils");
//在入口文件现有 import 的后面添加 import
fs.writeFileSync(
  resolveApp("app/.tmp/modify-layouts.js", true),
  "export default layouts => {\n" +
    getModifyLayouts()
      .map((item) => "require( `$(item) `).default(layouts);")
      .join("\t") +
    "\n};"
);
