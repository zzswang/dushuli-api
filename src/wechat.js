import tenpay from "tenpay";
import fs from "fs";
import WechatAPI from "co-wechat-api";

import { WECHAT_PAY, WECHAT } from "./config";

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
