/// <reference path='./def.d.ts' />
import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const getSignature = async ctx => {
      if (!ctx.query.url) throw createError(400, "url in query is required.");

      const req = {
        query: {
          url: ctx.query.url,
        },
        context: ctx, // here we put koa context in request
      };

      const res = await this.getSignature(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    router.get("/signature", ...this.middlewares("getSignature"), getSignature);
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
   * get wechat js sdk signature
   *
   * @abstract
   * @param {GetSignatureRequest} req getSignature request
   * @returns {GetSignatureResponse} Expected response to a valid request
   */
  getSignature(req) {
    throw new Error("not implemented");
  }
}
