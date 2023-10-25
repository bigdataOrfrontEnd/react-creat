#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { resolveApp } = require("../config/utils");
const rootPath = path.resolve(__dirname, resolveApp("app/components"));
const pathMap = {};
const walk = (dirPath, appId) => {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, appId);
    }
    if (stat.isFile() && (file === "index.tsx" || file == "index.jsx")) {
      const parentPath = path.basename(path.dirname(filePath));
      pathMap[`${appId}/${parentPath}`] = filePath;
    }
  });
};
walk(rootPath, "ims");
console.log(pathMap);
fs.writeFileSync(path.join(rootPath, "path.json"), JSON.stringify(pathMap));
