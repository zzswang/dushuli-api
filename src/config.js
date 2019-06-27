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
export const SCHEDULE_INTERVAL = env("SCHEDULE_INTERVAL", 5);
export const TOKEN = env(
  "TOKEN",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTVlYjBhZjBlM2VjOWY5OGE2OGViYyIsInVzZXJJZCI6IjVhYTVlYjBhZjBlM2VjOWY5OGE2OGViYyIsInVzZXIiOnsibmFtZSI6Inp6c3dhbmciLCJhdmF0YXIiOiJodHRwczovL2F2YXRhcnMzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE1MjQ3NDU_dj00IiwicHJvdmlkZXJzIjpbeyJzb3VyY2UiOiJnaXRodWIiLCJhY2Nlc3NUb2tlbiI6IjM0MDU4YTNjMmE0ODc5YWE1YTQ5ZDcwY2E4YmFjZWQyNTdhMWVmNjkiLCJmb3JlaWduSWQiOiIxNTI0NzQ1IiwiZGF0YSI6eyJsb2dpbiI6Inp6c3dhbmciLCJpZCI6MTUyNDc0NSwibm9kZV9pZCI6Ik1EUTZWWE5sY2pFMU1qUTNORFU9IiwiYXZhdGFyX3VybCI6Imh0dHBzOi8vYXZhdGFyczMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTUyNDc0NT92PTQiLCJncmF2YXRhcl9pZCI6IiIsInVybCI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vdXNlcnMvenpzd2FuZyIsImh0bWxfdXJsIjoiaHR0cHM6Ly9naXRodWIuY29tL3p6c3dhbmciLCJmb2xsb3dlcnNfdXJsIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2Vycy96enN3YW5nL2ZvbGxvd2VycyIsImZvbGxvd2luZ191cmwiOiJodHRwczovL2FwaS5naXRodWIuY29tL3VzZXJzL3p6c3dhbmcvZm9sbG93aW5ney9vdGhlcl91c2VyfSIsImdpc3RzX3VybCI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vdXNlcnMvenpzd2FuZy9naXN0c3svZ2lzdF9pZH0iLCJzdGFycmVkX3VybCI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vdXNlcnMvenpzd2FuZy9zdGFycmVkey9vd25lcn17L3JlcG99Iiwic3Vic2NyaXB0aW9uc191cmwiOiJodHRwczovL2FwaS5naXRodWIuY29tL3VzZXJzL3p6c3dhbmcvc3Vic2NyaXB0aW9ucyIsIm9yZ2FuaXphdGlvbnNfdXJsIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2Vycy96enN3YW5nL29yZ3MiLCJyZXBvc191cmwiOiJodHRwczovL2FwaS5naXRodWIuY29tL3VzZXJzL3p6c3dhbmcvcmVwb3MiLCJldmVudHNfdXJsIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2Vycy96enN3YW5nL2V2ZW50c3svcHJpdmFjeX0iLCJyZWNlaXZlZF9ldmVudHNfdXJsIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2Vycy96enN3YW5nL3JlY2VpdmVkX2V2ZW50cyIsInR5cGUiOiJVc2VyIiwic2l0ZV9hZG1pbiI6ZmFsc2UsIm5hbWUiOiJ6enN3YW5nIiwiY29tcGFueSI6bnVsbCwiYmxvZyI6IiIsImxvY2F0aW9uIjpudWxsLCJlbWFpbCI6Inp6c3dhbmdAZ21haWwuY29tIiwiaGlyZWFibGUiOm51bGwsImJpbyI6bnVsbCwicHVibGljX3JlcG9zIjoyOSwicHVibGljX2dpc3RzIjo2LCJmb2xsb3dlcnMiOjE4LCJmb2xsb3dpbmciOjE0LCJjcmVhdGVkX2F0IjoiMjAxMi0wMy0xMVQwMzoyMDoyMloiLCJ1cGRhdGVkX2F0IjoiMjAxOC0wNi0yMFQwMTowNDoxN1oiLCJ1c2VybmFtZSI6Inp6c3dhbmcifX1dLCJkZWxldGVkIjpmYWxzZSwib2ZmaWNpYWwiOmZhbHNlLCJyb2xlcyI6WyJUQVNLX0FETUlOIl0sImNyZWF0ZWRBdCI6IjIwMTgtMDMtMTJUMDI6NTA6NTAuMDYyWiIsInVwZGF0ZWRBdCI6IjIwMTgtMDYtMjBUMDE6NTc6NTIuMzU3WiIsImlkIjoiNWFhNWViMGFmMGUzZWM5Zjk4YTY4ZWJjIn0sImlhdCI6MTUyOTQ1OTg3Mn0.Bv6Y43Ttak4HNFb4_gv0urAGIEgz0-b45HcksN9uxNrDrkafBZuQKvbgG4tPbYGIdaelnyrJiUjPI7WEQa3QF5yNjeoA38CMN34z8HnETMEWUfehraTsMFDwxBhIv_gFQHEkUVR5OLgaEy9ASgRrf0VGi8GOWIbXV55vi_48nbs"
);
export const CONTENT_BASE = env("CONTENT_BASE", "");
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
