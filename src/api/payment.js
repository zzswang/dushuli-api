/// <reference path='./def.d.ts' />
import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const createPayment = async ctx => {
      const req = {
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.createPayment(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    router.post(
      "/payment",
      ...this.middlewares("createPayment"),
      createPayment
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
   * initiate a payment process
   *
   * @abstract
   * @param {CreatePaymentRequest} req createPayment request
   * @returns {CreatePaymentResponse} Expected response to a valid request
   */
  createPayment(req) {
    throw new Error("not implemented");
  }
}
