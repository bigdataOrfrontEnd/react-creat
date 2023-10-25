const fs = require("fs");
const path = require("path");
const { resolveApp } = require("../config/utils");
const pagelist = [];
const compPathId = [];
const walkSync = (dir) => {
  // readdirSync方法将返回一个包含“指定目录下所有文件名称”的数组对象。
  const files = fs.readdirSync(dir).sort(); // windows环境下排序
  let pathlist = [];
  files.forEach((file) => {
    const childPath = dir + "/" + file;
    // stats.isDirectiory(): 如果是目录则返回true,否则返回false;
    if (fs.statSync(childPath).isDirectory()) {
      pathlist = walkSync(childPath, pagelist);
    } else {
      (file.endsWith("jsx") || file.endsWith("tsx") || file.endsWith(".vue")) &&
        pagelist.push(childPath);
    }
  });
  return pathlist;
};
/**
 * 用于生成input的值对应的唯一哈希值
 */
const generateHash = (input) => {
  let I64BIT_TABLE = "ABGDFSEOFIKLOIUJo_-".split("");
  let hash = 5381;
  let i = input.length - 1;
  if (typeof input === "string") {
    for (input.length - 1; i > -1; i--) {
      hash += (hash << 5) + input.charCodeAt(i);
    }
  } else {
    for (; i > -1; i--) {
      hash += (hash << 5) + input[i];
    }
  }
  let value = hash & 0x7fffffff;
  let retValue = "";
  do {
    retValue += I64BIT_TABLE[value & 0x3f];
  } while ((value >>= 6));
  return retValue;
};
let pagePath = "app/pages";
walkSync(resolveApp(pagePath));
pagelist.forEach((p, i) => {
  p = p.split(path.sep).join("/");
  p = p.substring(p.indexOf(pagePath));
  const pathname = p
    .replace(`${pagePath}/`, "")
    .replace(/\.(tsx|jsx|vue)/)
    .replace(/\//g, "_");
  compPathId[pathname] = `comp_${generateHash(pathname)}`;
});
fs.writeFileSync(
  resolveApp("app/.tmp/compIds.ts", true),
  "export default" + JSON.stringify(compPathId, null, "\t")
);
