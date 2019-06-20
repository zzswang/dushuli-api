import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";
import { REPLY_TYPE, MSG_TYPE } from "../constants";

//参考文档 https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/customer-message/customerServiceMessage.send.html

const imageSchema = new mongoose.Schema({
  media_id: String,
});

const linkSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  thumb_url: String,
});

const replySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(REPLY_TYPE),
      default: REPLY_TYPE.KEYWORD,
    },
    keyword: {
      type: String,
    },
    msgtype: {
      type: String,
      enum: Object.values(MSG_TYPE),
      default: MSG_TYPE.TEXT,
    },
    content: String,
    image: imageSchema,
    link: linkSchema,
    active: Boolean,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

class Reply {
  id;
  createdAt;
  updatedAt;
  deleted;
  deletedAt;

  autoReply;
  active;
}

replySchema.plugin(helper);
replySchema.loadClass(Reply);

const Model = mongoose.model("Reply", replySchema);

export default Model;
