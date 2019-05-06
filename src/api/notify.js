/// <reference path='./def.d.ts' />
import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const wechatPayCallback = async ctx => {
      const req = {
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.wechatPayCallback(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    router.post(
      "/wechat-pay-notify",
      ...this.middlewares("wechatPayCallback"),
      wechatPayCallback
    );
  }

  /**
   * implement following abstract methods in the inherited class
   */

  /**
   * Ability to inject some middlewares
   *
   * @param {string} operation name of operation
   * @returns {function[]} middlewares
   */
  middlewares(operation) {
    return [];
  }

  /**
   * wechat pay callback
   *
   * @abstract
   * @param {WechatPayCallbackRequest} req wechatPayCallback request
   * @returns {WechatPayCallbackResponse} Expected response to a valid request
   */
  wechatPayCallback(req) {
    throw new Error("not implemented");
  }
}
