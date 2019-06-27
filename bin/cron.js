/**
 * 读书历读书提醒定时任务
 */
const mongoose = require("mongoose");
// const path = require("path");
// const LineByLineReader = require("line-by-line");
const moment = require("moment");
const schedule = require("node-schedule");
const postJSON = require("co-wechat-api/lib/util").postJSON;
const Content = require("@36node/content-sdk");

const {
  MONGODB_CONNECTION,
  SCHEDULE_INTERVAL,
  TOKEN,
  CONTENT_BASE,
} = require("../dist/config");
const Setting = require("../dist/models/setting").default;
const FormId = require("../dist/models/formId").default;
const { wechatApi, wechatAppApi } = require("../dist/wechat");

const content = new Content({
  base: CONTENT_BASE,
  token: TOKEN,
});

async function sendTemplate(
  touser,
  template_id,
  page,
  form_id,
  template_data,
  emphasis_keyword
) {
  const { accessToken } = await wechatAppApi.ensureAccessToken();
  const prefix = "https://api.weixin.qq.com/cgi-bin/";
  const url =
    prefix + "message/wxopen/template/send?access_token=" + accessToken;
  const data = {
    touser,
    template_id,
    page,
    form_id,
    data: template_data,
    emphasis_keyword,
  };
  return wechatAppApi.request(url, postJSON(data));
}

async function main() {
  const slug = moment().format("YYYYMMDD");
  const { body: post } = await content.post.getPost({
    postId: slug,
  });

  const start = moment()
    .subtract(SCHEDULE_INTERVAL, "minutes")
    .format("HH:mm");
  const end = moment().format("HH:mm");
  const settings = await Setting.find({
    disableAlarm: false,
    alarm: {
      $gte: start,
      $lte: end,
    },
  });

  for (let setting of settings) {
    const promises = [];
    if (setting.openid) {
      promises.push(
        wechatApi.sendText(
          setting.openid,
          `今日必读${post.title}\n"${post.summary}"\n\n☞☞<a href="https://www.yuewen365.com/read"> 点击开始听书吧~ </a>`
        )
      );
    }

    const formId = await FormId.findOne({
      user: setting.user,
      used: false,
    });
    if (setting.appOpenid && formId) {
      formId.useFormId();

      promises.push(
        sendTemplate(
          setting.appOpenid,
          "aNxY5FGiU5dKJ7ojqnatAwNqMGg8hIl81ZozVmHpy5k",
          "pages/index/main",
          formId.formId,
          {
            keyword1: {
              value: post.title,
            },
            keyword2: {
              value: post.summary,
            },
          },
          null
        )
      );
    }
    try {
      await Promise.all(promises);
    } catch (e) {
      console.error(e);
    }
  }
}

mongoose.connect(MONGODB_CONNECTION, { useNewUrlParser: true }).then(() => {
  schedule.scheduleJob(`*/${SCHEDULE_INTERVAL} * * * *`, main);
});

mongoose.connection.on("error", () => console.error("数据库连接错误"));
