import API from "../api/notify";
import { wechatPayApi } from "../wechat";

export class Service extends API {
  /**
   * Ability to inject some middlewares
   *
   * @param {string} operation name of operation
   * @returns {function[]} middlewares
   */
  middlewares(operation) {
    const middlewares = {
      wechatPayCallback: wechatPayApi.middleware("pay"),
    };

    return middlewares[operation] || [];
  }
  /**
   * wechat pay callback
   *
   * @abstract
   * @param {WechatPayCallbackRequest} req wechatPayCallback request
   * @returns {WechatPayCallbackResponse} Expected response to a valid request
   */
  wechatPayCallback(req) {
    const { context } = req;

    const data = context.request.weixin;
    console.info(data);

    context.reply();
  }
}

export default Service();
