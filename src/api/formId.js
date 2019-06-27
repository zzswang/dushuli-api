/// <reference path='./def.d.ts' />
import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const createFormId = async ctx => {
      const req = {
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.createFormId(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 201;
    };

    router.post("/formIds", ...this.middlewares("createFormId"), createFormId);
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
   * Save formId 保存小程序 formId
   *
   * @abstract
   * @param {CreateFormIdRequest} req createFormId request
   * @returns {CreateFormIdResponse} The formId created
   */
  createFormId(req) {
    throw new Error("not implemented");
  }
}
