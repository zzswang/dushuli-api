import Reply from "../models/reply";
import { REPLY_TYPE, MSG_TYPE } from "../constants";

export default async function initProducts() {
  await Reply.findOneAndUpdate(
    { active: true, type: REPLY_TYPE.KEYWORD, keyword: "1" },
    {
      msgtype: MSG_TYPE.IMAGE,
      image: {
        media_id: "poar0UCzzVO_nQPypRlSSKbpqJfQqDjt0m7q9MYMHrFsGBKA",
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
    { active: true, type: REPLY_TYPE.KEYWORD, keyword: "2" },
    {
      msgtype: MSG_TYPE.LINK,
      link: {
        title: "关注服务号",
        description: "免费领取14天VIP，每天一本好书，等你享受知识的盛宴。",
        url: "https://mp.weixin.qq.com/s/2f-fCTxXPKWDipMu7SZY3Q",
        thumb_url: "https://dushuli-static.36node.com/wxapp/dushuli.png",
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
    { active: true, type: REPLY_TYPE.KEYWORD, keyword: "test-text" },
    {
      msgtype: MSG_TYPE.TEXT,
      content: "hello-world",
      active: true,
      deleted: false,
    },
    {
      new: true,
      upsert: true,
    }
  );

  await Reply.findOneAndUpdate(
    { active: true, type: REPLY_TYPE.KEYWORD, keyword: "test-miniprogrampage" },
    {
      msgtype: MSG_TYPE.MINI_PROGRAM_PAGE,
      miniprogrampage: {
        title: "测试小程序",
        pagepath: "pages/index/main",
        thumb_media_id: "poar0UCzzVO_nQPypRlSSKbpqJfQqDjt0m7q9MYMHrFsGBKA",
      },
      active: true,
      deleted: false,
    },
    {
      new: true,
      upsert: true,
    }
  );
}
