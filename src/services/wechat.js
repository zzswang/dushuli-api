import createError from "http-errors";
import { postJSON } from "co-wechat-api/lib/util";
import path from "path";
import fs from "fs";
import byline from "byline";
import download from "download-file";
import xml2js from "xml2js";
import moment from "moment";
import { post } from "../lib/network";

import API from "../api/wechat";
import { wechatApi, wechatPayApi, wechat, wechatAppApi } from "../wechat";
import { PAYMENT_METHOD, ORDER_STATUS } from "../constants";

import Product from "../models/product";
import Order from "../models/order";
import Member from "../models/member";
import Reply from "../models/reply";
import Config from "../models/config";
import Invitation from "../models/invitation";
import { REPLY_TYPE, MSG_TYPE, INFO_TYPE, PIC_URL } from "../constants";
import { MESSAGE_DELAY, WECHAT } from "../config";
import WXBizMsgCrypt from "../lib/wxCrypt";

const msgCrypto = new WXBizMsgCrypt(
  WECHAT.COMPONENT_TOKEN,
  WECHAT.COMPONENT_KEY,
  WECHAT.COMPONENT_APPID
);

const xmlParser = new xml2js.Parser({
  explicitRoot: false,
  explicitArray: false,
});

function parseXMLSync(str) {
  return new Promise(function(resolve, reject) {
    xmlParser.parseString(str, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

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

  async getWechatPushEvent(req) {
    const { timestamp, nonce, msg_signature } = req.query;

    const bodyRaw = req.body.toString();
    const bodyXml = await parseXMLSync(bodyRaw);

    const { Encrypt } = bodyXml;

    const str = msgCrypto.decryptMsg(msg_signature, timestamp, nonce, Encrypt);
    const xml = await parseXMLSync(str);

    if (xml.Event === "SCAN") {
      let resXml;
      if (xml.EventKey === "invitation") {
        const title = "以注册码来注册";
        const desc = "提供每日好书解读及日历提醒";
        const url = "http://www.yuewen365.com/invitation-register";

        resXml = `<xml><ToUserName><![CDATA[${xml.FromUserName}]]></ToUserName><FromUserName><![CDATA[${xml.ToUserName}]]></FromUserName><CreateTime>${timestamp}</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>1</ArticleCount><Articles>
        <item><Title><![CDATA[${title}]]></Title><Description><![CDATA[${desc}]]></Description><PicUrl><![CDATA[${PIC_URL}]]></PicUrl><Url><![CDATA[${url}]]></Url></item></Articles></xml>`;
      } else if (/^2020\d{4}$/.test(xml.EventKey)) {
        const title = `每日读书 - ${moment(xml.EventKey).format("YYYY.MM.DD")}`;
        const desc = "提供每日好书解读及日历提醒";
        const url = `http://www.yuewen365.com/read/calendar/${xml.EventKey}`;

        resXml = `<xml><ToUserName><![CDATA[${xml.FromUserName}]]></ToUserName><FromUserName><![CDATA[${xml.ToUserName}]]></FromUserName><CreateTime>${timestamp}</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>1</ArticleCount><Articles>
        <item><Title><![CDATA[${title}]]></Title><Description><![CDATA[${desc}]]></Description><PicUrl><![CDATA[${PIC_URL}]]></PicUrl><Url><![CDATA[${url}]]></Url></item></Articles></xml>`;
      }

      if (resXml) {
        return {
          body: msgCrypto.encryptMsg(resXml, timestamp, nonce),
        };
      }
    }

    return { body: "success" };
  }

  async getAuthorizerAccessToken(req) {
    const { auth_code } = req.query;

    const token = await Config.findOne({ key: INFO_TYPE.ComponentAccessToken });

    const url = `https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=${token.value}`;

    const body = {
      component_appid: WECHAT.COMPONENT_APPID,
      authorization_code: auth_code,
    };
    const ret = await post(url, body);

    await Config.findOneAndUpdate(
      { key: INFO_TYPE.AuthorizerAccessToken },
      {
        value: ret.data.authorization_info.authorizer_access_token,
      },
      {
        new: true,
        upsert: true,
      }
    );

    await Config.findOneAndUpdate(
      { key: INFO_TYPE.AuthorizerRefreshToken },
      {
        value: ret.data.authorization_info.authorizer_refresh_token,
      },
      {
        new: true,
        upsert: true,
      }
    );

    const date = new Date();
    date.setHours(date.getHours() + 2);

    await Config.findOneAndUpdate(
      { key: INFO_TYPE.AuthorizerExpiresAt },
      {
        value: date,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return { body: "success" };
  }

  async getComponentVerifyTicket(req) {
    const { timestamp, nonce, msg_signature } = req.query;

    const bodyRaw = req.body.toString();
    const bodyXml = await parseXMLSync(bodyRaw);

    const { Encrypt } = bodyXml;

    const str = msgCrypto.decryptMsg(msg_signature, timestamp, nonce, Encrypt);
    const xml = await parseXMLSync(str);

    await Config.findOneAndUpdate(
      { key: INFO_TYPE.ComponentVerifyTicket },
      {
        value: xml.ComponentVerifyTicket,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return { body: "success" };
  }

  async getPreAuthCode(req) {
    const ticket = await Config.findOne({
      key: INFO_TYPE.ComponentVerifyTicket,
    });
    const token = await Config.findOne({ key: INFO_TYPE.ComponentAccessToken });

    let access_token;

    if (!token || token.expiredAt < new Date()) {
      const url =
        "https://api.weixin.qq.com/cgi-bin/component/api_component_token";
      const body = {
        component_appid: WECHAT.COMPONENT_APPID,
        component_appsecret: WECHAT.COMPONENT_APPSECRET,
        component_verify_ticket: ticket.value,
      };
      const ret = await post(url, body);

      const date = new Date();
      date.setHours(date.getHours() + 2);

      access_token = ret.data.component_access_token;

      await Config.findOneAndUpdate(
        { key: INFO_TYPE.ComponentAccessToken },
        {
          value: access_token,
          expiredAt: date,
        },
        {
          new: true,
          upsert: true,
        }
      );
    } else {
      access_token = token.value;
    }

    const url = `https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=${access_token}`;
    const body = {
      component_appid: WECHAT.COMPONENT_APPID,
    };
    const ret = await post(url, body);

    return {
      body: {
        code: ret.data.pre_auth_code,
      },
    };
  }

  async dev(req) {
    let stream = fs.createReadStream("/Users/lidong/Downloads/icode.txt");
    stream = byline.createStream(stream);
    let i = 1;

    stream.on("data", async function(line) {
      await Invitation.create({
        code: line.toString(),
        start: "2019-12-31 16:00:00.000Z",
        end: "2020-12-31 15:59:59.000Z",
        source: "2020读书历注册码",
      });
      console.log(i++);
    });

    return { body: "success" };
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

  download(url, options) {
    return new Promise((resolve, reject) =>
      download(url, options, e => {
        if (e) {
          reject(e);
        }
        resolve();
      })
    );
  }

  async checkImageMedia(image) {
    let error = null;
    if (image.media_id) {
      try {
        await wechatAppApi.getMedia(image.media_id); // 检查图片是否过期
      } catch (e) {
        error = e;
      }
    }

    if (!image.media_id || error) {
      const filepath = path.join(__dirname, `../../images/${image.filename}`);
      if (!fs.existsSync(filepath)) {
        // 如果图片文件不存在则从url下载
        const options = {
          directory: path.join(__dirname, "../../images/"),
          filename: image.filename,
        };
        await this.download(image.url, options);
      }
      // 重新上传图片
      let res = await wechatAppApi.uploadImageMedia(filepath);
      res = JSON.parse(res.toString());
      return res.media_id;
    }
  }

  message() {
    return wechat.middleware(async (message, ctx) => {
      let replies;
      if (
        message.MsgType === "event" &&
        message.Event === "user_enter_tempsession"
      ) {
        replies = await Reply.find(
          {
            active: true,
            type: REPLY_TYPE.AUTO,
          },
          null,
          {
            sort: {
              index: 1,
            },
          }
        );
      }

      if ((message.MsgType = "text")) {
        replies = await Reply.find(
          {
            active: true,
            type: REPLY_TYPE.KEYWORD,
            keyword: message.Content,
          },
          null,
          {
            sort: {
              index: 1,
            },
          }
        );
      }

      if (replies) {
        for (let i = 0; i < replies.length; i++) {
          const touser = message.FromUserName;
          const reply = replies[i];

          if (i === 0) {
            await this.send(touser, reply);
          } else {
            this.delaySend(touser, reply, MESSAGE_DELAY);
          }
        }
      }

      return "success";
    });
  }

  async send(touser, reply) {
    switch (reply.msgtype) {
      case MSG_TYPE.TEXT:
        await this.sendText(touser, reply.content);
        break;
      case MSG_TYPE.IMAGE:
        reply.image.media_id = await this.checkImageMedia(reply.image);
        reply = await reply.save();
        await this.sendImage(touser, reply.image);
        break;
      case MSG_TYPE.LINK:
        await this.sendLink(touser, reply.link);
        break;
      default:
        await this.sendText(touser, reply.content);
        break;
    }
  }

  delaySend(touser, reply, delay = MESSAGE_DELAY) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await this.send(touser, reply);
          resolve();
        } catch (e) {
          reject(e);
        }
      }, delay);
    });
  }

  sendText(touser, content) {
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
}

export default new Service();
