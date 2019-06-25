import dotenv from "dotenv";

/**
 * init dotenv
 * priority: environment -> .env
 *
 * Available settings
 *
 * APP_PORT=9527
 * APP_BASE_PATH=/v1
 * APP_JWT_PUBLIC_KEY=`a public key string`
 */

dotenv.config();

/**
 *
 * @param {string} name envrionment name
 * @param {object} opt option with { required, default }
 * @returns {*} value
 */

export function env(name, init) {
  const value = process.env[`APP_${name.toUpperCase()}`] || init;

  if (value === undefined) {
    throw new Error(`environment ${name} is missing`);
  }

  return value;
}

/**
 * exports
 */
export const PORT = env("PORT", 9527);
export const BASE = env("BASE", "/dushuli/v0");
export const MESSAGE_DELAY = env("MESSAGE_DELAY", 5000);
/**
 * Mongodb
 */

export const MONGODB_CONNECTION = env(
  "MONGODB_CONNECTION",
  "mongodb://localhost/dushuli"
);

/**
 * wechat pay
 */
export const WECHAT_PAY = {
  APP_ID: env("WECHAT_OFFICIAL_APP_ID", ""),
  MCH_ID: env("WECHAT_PAY_MCH_ID", ""),
  PARTNER_KEY: env("WECHAT_PAY_PARTNER_KEY", ""),
  PFX: env("WECHAT_PAY_PFX", ""),
  NOTIFY_URL: env("WECHAT_PAY_NOTIFY_URL", ""),
  SPBILL_CREATE_IP: env("WECHAT_PAY_SPBILL_CREATE_IP", ""),
};

/**
 * wechat
 */
export const WECHAT = {
  APP_ID: env("WECHAT_OFFICIAL_APP_ID", ""),
  APP_SECRET: env("WECHAT_OFFICIAL_APP_SECRET", ""),
};

/**
 * wechat mini program
 */
export const WECHAT_APP = {
  APP_ID: env("WECHAT_APP_APP_ID", ""),
  APP_SECRET: env("WECHAT_APP_APP_SECRET", ""),
  TOKEN: env("WECHAT_APP_TOKEN", ""),
  ENCODING_AES_KEY: env("WECHAT_APP_ENCODING_AES_KEY", ""),
};
