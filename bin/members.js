/**
 * 读书历会员迁移脚本
 * 一次性使用
 */
const mongoose = require("mongoose");
const path = require("path");
const LineByLineReader = require("line-by-line");
const moment = require("moment");

const { MONGODB_CONNECTION } = require("../dist/config");
const Member = require("../dist/models/member").default;

function getFilePath(file) {
  return path.resolve(__dirname, "..", "data", file);
}

async function processUsers() {
  const filePath = getFilePath("users");
  const members = [];
  const lr = new LineByLineReader(filePath);

  lr.on("line", line => {
    const data = JSON.parse(line);
    if (
      data.deleted ||
      !data.ns.includes("/dushuli") ||
      !data.phone ||
      !data.expireAt
    ) {
      return;
    }

    let member;

    if (
      moment(data.expireAt.$date).format("YYYY-MM-DD") !==
      moment()
        .endOf("year")
        .format("YYYY-MM-DD")
    ) {
      member = {
        user: data._id.$oid,
        period: [
          {
            start: moment()
              .startOf("year")
              .toISOString(),
            end: data.expireAt.$date,
            active: false,
            trial: false,
            product: {
              name: "2019年读书历实体日历-30天",
            },
          },
        ],
        active: true,
      };
    } else {
      member = {
        user: data._id.$oid,
        period: [
          {
            start: moment()
              .startOf("year")
              .toISOString(),
            end: data.expireAt.$date,
            active: true,
            trial: false,
            product: {
              name: "2019年读书历实体日历-全年",
            },
          },
        ],
        active: true,
      };
    }

    members.push(member);
  });

  lr.on("error", err => {
    console.error(err);
  });

  lr.on("end", async () => {
    await Member.insertMany(members);
    console.info("migrate dushuli member successfully");
  });
}

mongoose
  .connect(MONGODB_CONNECTION, { useNewUrlParser: true })
  .then(async () => {
    await processUsers();
  });

mongoose.connection.on("error", () => console.error("数据库连接错误"));
