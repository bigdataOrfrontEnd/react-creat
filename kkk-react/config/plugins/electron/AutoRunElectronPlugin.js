const [spawn] = require("child_process");
const path = require("path");
// const config = {};
// 默认端口 环境变量中设的端口  外部配置文件中的端口 默认端口
const config = require(process.env.CONFIG_FILE);
