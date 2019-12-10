/**
 * 读书历导入邀请码
 */
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const byline = require("byline");

const { MONGODB_CONNECTION } = require("../dist/config");
const Invitation = require("../dist/models/invitation").default;

async function main() {
  let stream = fs.createReadStream(path.join(__dirname, "../icode.txt"));
  stream = byline.createStream(stream);

  stream.on("data", async function(line) {
    await Invitation.create({
      code: line.toString(),
      start: "2019-12-31 16:00:00.000Z",
      end: "2020-12-31 15:59:59.000Z",
      source: "2020读书历注册码",
    });
  });
}

mongoose.connect(MONGODB_CONNECTION, { useNewUrlParser: true }).then(() => {
  main();
  console.log("import success");
});

mongoose.connection.on("error", () => console.error("数据库连接错误"));
