import API from "../api/wechat";
import { wechatApi, wechatPayApi } from "../wechat";

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
];

export class Service extends API {
  middlewares(operation) {
    if (operation === "wechatPayCallback") {
      return [wechatPayApi.middleware("pay")];
    }
    return [];
  }

  async createPayment(req) {
    const { openid, description, fee } = req.body;

    const outTradeNo = `${new Date().valueOf()}${Math.round(
      Math.random() * 10000
    )}`;

    const params = await wechatPayApi.getPayParams({
      out_trade_no: outTradeNo,
      body: description || "读书历会员",
      total_fee: fee || "1",
      openid: openid,
    });
    return { body: params };
  }

  async getSignature(req) {
    const { url } = req.query;

    const res = await wechatApi.getJsConfig({ debug: false, url, jsApiList });

    return { body: res };
  }

  wechatPayCallback(req) {
    const { context } = req;

    const data = context.request.weixin;
    console.info("wechatPayCallback", data);

    context.reply();
  }
}

export default new Service();
