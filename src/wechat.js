import tenpay from "tenpay";
import fs from "fs";
import WechatAPI from "co-wechat-api";
import coWechat from "co-wechat";

import { WECHAT_PAY, WECHAT, WECHAT_APP } from "./config";

const config = {
  appid: WECHAT_PAY.APP_ID,
  mchid: WECHAT_PAY.MCH_ID,
  partnerKey: WECHAT_PAY.PARTNER_KEY,
  pfx: WECHAT_PAY.PFX ? fs.readFileSync(WECHAT_PAY.PFX) : undefined,
  notify_url: WECHAT_PAY.NOTIFY_URL,
  spbill_create_ip: WECHAT_PAY.SPBILL_CREATE_IP,
};

export const wechatPayApi = new tenpay(config, true);

export const wechatApi = new WechatAPI(WECHAT.APP_ID, WECHAT.APP_SECRET);

export const wechatAppApi = new WechatAPI(
  WECHAT_APP.APP_ID,
  WECHAT_APP.APP_SECRET
);

export const wechat = coWechat({
  token: WECHAT_APP.TOKEN,
  appid: WECHAT_APP.APP_ID,
  encodingAESKey: WECHAT_APP.ENCODING_AES_KEY,
});
