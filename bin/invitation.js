/**
 * 读书历邀请码迁移脚本
 * 一次性使用
 */
const mongoose = require("mongoose");
const path = require("path");
const LineByLineReader = require("line-by-line");
const moment = require("moment");

const { MONGODB_CONNECTION } = require("../dist/config");
const Invitation = require("../dist/models/invitation").default;

function getFilePath(file) {
  return path.resolve(__dirname, "..", "data", file);
}

async function processInvitation() {
  const filePath = getFilePath("invitations");
  const invitations = [];
  const lr = new LineByLineReader(filePath);

  lr.on("line", line => {
    const data = JSON.parse(line);
    if (data.deleted || data.sub !== "ACTIVE") {
      return;
    }

    const invitation = {
      _id: data._id.$oid,
      code: data.code,
      email: data.email,
      phone: data.phone,
      period: data.period ? data.period * 1000 : undefined,
      start: data.until
        ? moment()
            .startOf("year")
            .toISOString()
        : undefined,
      end: data.until ? data.until.$date : undefined,
      used: data.used,
      usedAt: data.usedAt ? data.usedAt.$date : undefined,
      usedBy: "",
      source: "读书历实体日历",
      comment: "",
      user: {},
    };

    invitations.push(invitation);
  });

  lr.on("error", err => {
    console.error(err);
  });

  lr.on("end", async () => {
    await Invitation.insertMany(invitations);
    console.info("migrate dushuli invitaions successfully");
  });
}

mongoose
  .connect(MONGODB_CONNECTION, { useNewUrlParser: true })
  .then(async () => {
    await processInvitation();
  });

mongoose.connection.on("error", () => console.error("数据库连接错误"));
