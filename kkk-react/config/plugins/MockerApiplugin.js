const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const { resolveApp } = require("../utils");

class MockerApiplugin {
  apply(compiler) {
    let changedFiles = [];
    // https://stackoverflow.com/a/64564708/6543789
    compiler.hooks.watchRun.tap("watchRun", (watching) => {
      if (watching.modifiedFiles) {
        changedFiles = Array.from(watching.modifiedFiles);
      }
    });
    compiler.hooks.done.tap(" done", (compilation) => {
      // 编译结束后，通过模拟app/mock/.mock的文件更新来触发mock-api重新加载_mock.js files
      if (
        changedFiles.some(
          (item) =>
            path.basename(item) === " mock.js" ||
            path.basename(item) === " mock.ts"
        )
      ) {
        console.log(chalk.green("mock file changed"));
        fs.writeFile(
          resolveApp("app/mock/.mock", true),
          "mocker-api",
          () => {}
        );
      }
    });
  }
}
module.exports = MockerApiplugin;
