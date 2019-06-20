import createError from "http-errors";
import { postJSON } from "co-wechat-api/lib/util";

import API from "../api/wechat";
import { wechatApi, wechatPayApi, wechat, wechatAppApi } from "../wechat";
import { PAYMENT_METHOD, ORDER_STATUS } from "../constants";

import Product from "../models/product";
import Order from "../models/order";
import Member from "../models/member";
import Reply from "../models/reply";
import { REPLY_TYPE, MSG_TYPE } from "../constants";

const jsApiList = [
  "checkJsApi",
  "onMenuShareTimeline",
  "onMenuShareAppMessage",
  "onMenuShareQQ",
  "onMenuShareWeibo",
  "onMenuShareQZone",
  "chooseImage",
  "previewImage",
  "uploadImage",
  "startRecord",
  "stopRecord",
  "onVoiceRecordEnd",
  "playVoice",
  "pauseVoice",
  "stopVoice",
  "onVoicePlayEnd",
  "uploadVoice",
  "downloadVoice",
  "translateVoice",
  "getNetworkType",
  "openLocation",
  "getLocation",
  "startSearchBeacons",
  "stopSearchBeacons",
  "onSearchBeacons",
  "closeWindow",
  "hideMenuItems",
  "showMenuItems",
  "hideAllNonBaseMenuItem",
  "showAllNonBaseMenuItem",
  "scanQRCode",
  "openProductSpecificView",
  "chooseCard",
  "addCard",
  "openCard",
  "chooseWXPay",
  "updateAppMessageShareData",
  "updateTimelineShareData",
];

export class Service extends API {
  middlewares(operation) {
    if (operation === "wechatPayCallback") {
      return [wechatPayApi.middleware("pay")];
    }
    return [];
  }

  async createPayment(req) {
    const { openid, product, user } = req.body;

    // 查找对应的商品
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      throw createError("Product not found", 500);
    }

    // 创建订单 或 查找该用户的待支付订单
    const orderDoc = await Order.findOneAndUpdate(
      {
        createdBy: user.id,
        status: ORDER_STATUS.CREATED,
        product: product,
        method: PAYMENT_METHOD.WECHAT_APY,
      },
      {
        no: `${new Date().valueOf()}${Math.round(Math.random() * 10000)}`,
        status: ORDER_STATUS.CREATED,
        product: product,
        method: PAYMENT_METHOD.WECHAT_APY,
        data: {},
        user,
        createdBy: user.id,
      },
      {
        new: true,
        upsert: true,
      }
    );

    const params = await wechatPayApi.getPayParams({
      out_trade_no: orderDoc.no,
      body: productDoc.name,
      total_fee: productDoc.price * 100,
      openid,
    });
    return { body: params };
  }

  async getSignature(req) {
    const { url } = req.query;

    const res = await wechatApi.getJsConfig({ debug: false, url, jsApiList });

    return { body: res };
  }

  async paymentCallback(ctx) {
    const data = ctx.request.weixin;

    // 更新订单
    const order = await Order.findOneAndUpdate(
      {
        no: data.out_trade_no,
        status: ORDER_STATUS.CREATED,
      },
      {
        status: ORDER_STATUS.PAID,
        paidAt: new Date(),
        method: PAYMENT_METHOD.WECHAT_PAY,
        data,
        fee: data.total_fee / 100,
        deleted: false,
      },
      {
        new: true,
      }
    );

    const product = await Product.findById(order.product);

    const member = await Member.findOne({
      user: order.createdBy,
      active: true,
    });

    // 更新有效期
    if (member) {
      const period =
        Array.isArray(member.period) &&
        member.period.find(period => period.product === product.id);

      if (!period) {
        if (!Array.isArray(member.period)) {
          member.period = [];
        }

        member.period.push({
          start: product.start,
          end: product.end,
          trial: false,
          product,
          order: order.no,
          active: true,
        });

        await member.save();
      }
    } else {
      await Member.create({
        user: order.createdBy,
        period: [
          {
            start: product.start,
            end: product.end,
            trial: false,
            product,
            order: order.no,
            active: true,
          },
        ],
        active: true,
      });
    }

    ctx.reply();
  }

  message() {
    return wechat.middleware(async (message, ctx) => {
      let reply;
      if (
        message.MsgType === "event" &&
        message.Event === "user_enter_tempsession"
      ) {
        reply = await Reply.findOne({
          active: true,
          type: REPLY_TYPE.AUTO,
        });
      }

      if ((message.MsgType = "text")) {
        reply = await Reply.findOne({
          active: true,
          type: REPLY_TYPE.KEYWORD,
          keyword: message.Content,
        });
      }

      if (reply) {
        const touser = message.FromUserName;
        switch (reply.msgtype) {
          case MSG_TYPE.TEXT:
            this.sendText(touser, reply.content);
            break;
          case MSG_TYPE.IMAGE:
            this.sendImage(touser, reply.image);
            break;
          case MSG_TYPE.LINK:
            this.sendLink(touser, reply.link);
            break;
          default:
            this.sendText(touser, reply.content);
            break;
        }
      }

      return "success";
    });
  }

  async sendText(touser, content) {
    return wechatAppApi.sendText(touser, content);
  }

  sendImage(touser, image) {
    return wechatAppApi.sendImage(touser, image.media_id);
  }

  async sendLink(touser, link) {
    const { accessToken } = await wechatAppApi.ensureAccessToken();
    const prefix = "https://api.weixin.qq.com/cgi-bin/";
    var url = prefix + "message/custom/send?access_token=" + accessToken;
    var data = {
      touser,
      msgtype: "link",
      link,
    };
    return wechatAppApi.request(url, postJSON(data));
  }

  sendMiniprogrampage(touser, minirogrampage) {
    return wechatAppApi.sendMiniProgram(touser, minirogrampage);
  }
}

export default new Service();
