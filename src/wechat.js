import tenpay from "tenpay";
import fs from "fs";
import WechatAPI from "co-wechat-api";
import coWechat from "co-wechat";

import { WECHAT_PAY, WECHAT, WECHAT_APP } from "./config";

import Config from "./models/config";

const config = {
  appid: WECHAT_PAY.APP_ID,
  mchid: WECHAT_PAY.MCH_ID,
  partnerKey: WECHAT_PAY.PARTNER_KEY,
  pfx: WECHAT_PAY.PFX ? fs.readFileSync(WECHAT_PAY.PFX) : undefined,
  notify_url: WECHAT_PAY.NOTIFY_URL,
  spbill_create_ip: WECHAT_PAY.SPBILL_CREATE_IP,
};

export const wechatPayApi = new tenpay(config, true);

async function readToken(appid) {
  const config = await Config.findOne({ key: appid });
  if (config) {
    return JSON.parse(config.value);
  }
  return "";
}
async function saveToken(appid, token) {
  await Config.findOneAndUpdate(
    { key: appid },
    {
      key: appid,
      value: JSON.stringify(token),
    },
    {
      upsert: true,
      new: true,
    }
  );
}

export const wechatApi = new WechatAPI(
  WECHAT.APP_ID,
  WECHAT.APP_SECRET,
  async () => readToken(WECHAT.APP_ID),
  async token => saveToken(WECHAT.APP_ID, token)
);

export const wechatAppApi = new WechatAPI(
  WECHAT_APP.APP_ID,
  WECHAT_APP.APP_SECRET,
  async () => readToken(WECHAT_APP.APP_ID),
  async token => saveToken(WECHAT_APP.APP_ID, token)
);

export const wechat = coWechat({
  token: WECHAT_APP.TOKEN,
  appid: WECHAT_APP.APP_ID,
  encodingAESKey: WECHAT_APP.ENCODING_AES_KEY,
});
