import Reply from "../models/reply";
import { REPLY_TYPE, MSG_TYPE } from "../constants";

const CONTENT = `☞☞新用户点击免费领取<a href="https://mp.weixin.qq.com/s/4vKkZvHJz_kcest5XwkWDQ">14天VIP会员</a>\n\n☞☞点击咨询如何使用<a href="https://mp.weixin.qq.com/s/DGr7E9FyBiqsLw78yQgxgw">全部VIP会员权益</a>\n\n☞☞点击<a href="https://mp.weixin.qq.com/s/kvJeaqFZlpMrY3GzdQonlw">关注读书历服务号</a>，查看个人信息、读书记录及读书历全部功能。\n\n☞☞点击<a href="https://mp.weixin.qq.com/s/dtiqzF8NkmKdepeVOnJwYA">更多问题</a>，了解使用中的其他问题解决方法。`;
const THUMB_URL = "https://dushuli-static.36node.com/wxapp/dushuli.png";
const VIP_URL = "https://mp.weixin.qq.com/s/4vKkZvHJz_kcest5XwkWDQ";
const PRIVILEGE_URL = "https://mp.weixin.qq.com/s/DGr7E9FyBiqsLw78yQgxgw";
const SUBSCRIBE_URL = "https://mp.weixin.qq.com/s/kvJeaqFZlpMrY3GzdQonlw";
const QUESTIONS_URL = "https://mp.weixin.qq.com/s/dtiqzF8NkmKdepeVOnJwYA";

export default async function initProducts() {
  await Reply.findOneAndUpdate(
    { active: true, type: REPLY_TYPE.KEYWORD, keyword: "11", index: 1 },
    {
      msgtype: MSG_TYPE.LINK,
      link: {
        title: "免费领取14天VIP会员",
        description: "",
        url: VIP_URL,
        thumb_url: THUMB_URL,
      },
      active: true,
      deleted: false,
    },
    {
      new: true,
      upsert: true,
    }
  );
  await Reply.findOneAndUpdate(
    { active: true, type: REPLY_TYPE.KEYWORD, keyword: "11", index: 2 },
    {
      msgtype: MSG_TYPE.TEXT,
      content: CONTENT,
      active: true,
      deleted: false,
    },
    {
      new: true,
      upsert: true,
    }
  );

  await Reply.findOneAndUpdate(
    { active: true, type: REPLY_TYPE.KEYWORD, keyword: "22", index: 1 },
    {
      msgtype: MSG_TYPE.LINK,
      link: {
        title: "体验更多VIP会员权益",
        description: "",
        url: PRIVILEGE_URL,
        thumb_url: THUMB_URL,
      },
      active: true,
      deleted: false,
    },
    {
      new: true,
      upsert: true,
    }
  );
  await Reply.findOneAndUpdate(
    { active: true, type: REPLY_TYPE.KEYWORD, keyword: "22", index: 2 },
    {
      msgtype: MSG_TYPE.TEXT,
      content: CONTENT,
      active: true,
      deleted: false,
    },
    {
      new: true,
      upsert: true,
    }
  );

  await Reply.findOneAndUpdate(
    { active: true, type: REPLY_TYPE.KEYWORD, keyword: "33", index: 1 },
    {
      msgtype: MSG_TYPE.LINK,
      link: {
        title: "关注读书历服务号，这里是你的读书大本营",
        description: "",
        url: SUBSCRIBE_URL,
        thumb_url: THUMB_URL,
      },
      active: true,
      deleted: false,
    },
    {
      new: true,
      upsert: true,
    }
  );
  await Reply.findOneAndUpdate(
    { active: true, type: REPLY_TYPE.KEYWORD, keyword: "33", index: 2 },
    {
      msgtype: MSG_TYPE.TEXT,
      content: CONTENT,
      active: true,
      deleted: false,
    },
    {
      new: true,
      upsert: true,
    }
  );

  await Reply.findOneAndUpdate(
    { active: true, type: REPLY_TYPE.KEYWORD, keyword: "44", index: 1 },
    {
      msgtype: MSG_TYPE.LINK,
      link: {
        title: "其他问题咨询",
        description: "",
        url: QUESTIONS_URL,
        thumb_url: THUMB_URL,
      },
      active: true,
      deleted: false,
    },
    {
      new: true,
      upsert: true,
    }
  );
  await Reply.findOneAndUpdate(
    { active: true, type: REPLY_TYPE.KEYWORD, keyword: "44", index: 2 },
    {
      msgtype: MSG_TYPE.TEXT,
      content: CONTENT,
      active: true,
      deleted: false,
    },
    {
      new: true,
      upsert: true,
    }
  );
}
