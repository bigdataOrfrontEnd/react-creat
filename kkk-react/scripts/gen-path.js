const fs = require("fs");
const path = require("path");
const { resolveApp } = require("../config/utils");
/**
 * 用于生成page目录下面所有index.jsx所在路径的数组,并写入/app/containers/path.json
 */
const pagelist = [];
let pagePath = "app/pages";
// 提取 index 的文件路径的方法
const walkSync = (dir) => {
  const files = fs.readdirSync(dir).sort(); // windows环境下排序
  let pathlist = [];
  files.forEach((file) => {
    let childpath = dir + "/" + file;
    if (fs.statSync(childpath).isDirectory()) {
      pathlist = walkSync(childpath, pathlist);
    } else {
      // 如果文件时 index.jsx 或 index.tsx 的话，去除index 再push到pagelist的数组中
      if (
        file.endsWith("index.jsx") ||
        file.endsWith("index.tsx") ||
        file.endsWith("index.vue")
      ) {
        childpath = childpath.split(path.sep).join("/");
        pagelist.push(
          childpath
            .substring(childpath.indexOf(pagePath))
            .replace(`${pagePath}/`, "")
            .replace(/\/index\.(tsx|jsx|vue)/, "")
        );
      }
    }
  });
  return pagePath;
};
// 传入baseDir
walkSync(resolveApp(pagePath));
fs.writeFileSync(
  resolveApp("app/.tmp/path.json", true),
  JSON.stringify(pagelist, null, "\t")
);
