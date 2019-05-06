import API from "../api/signature";
import { wechatApi } from "../wechat";

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
  async getSignature(req) {
    const { url } = req.query;

    // const ticket = await wechatApi.getLatestTicket();
    const res = await wechatApi.getJsConfig({ debug: false, url, jsApiList });

    return { body: res };
  }
}

export default new Service();
