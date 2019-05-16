/// <reference path='./def.d.ts' />
import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const getSetting = async ctx => {
      if (!ctx.params.user) throw createError(400, "user in path is required.");

      const req = {
        user: ctx.params.user,
        context: ctx, // here we put koa context in request
      };

      const res = await this.getSetting(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const deleteSetting = async ctx => {
      if (!ctx.params.user) throw createError(400, "user in path is required.");

      const req = {
        user: ctx.params.user,
        context: ctx, // here we put koa context in request
      };

      await this.deleteSetting(req);

      ctx.status = 204;
    };

    const updateSetting = async ctx => {
      if (!ctx.params.user) throw createError(400, "user in path is required.");

      const req = {
        user: ctx.params.user,
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.updateSetting(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    router.get(
      "/settings/:user",
      ...this.middlewares("getSetting"),
      getSetting
    );
    router.delete(
      "/settings/:user",
      ...this.middlewares("deleteSetting"),
      deleteSetting
    );
    router.put(
      "/settings/:user",
      ...this.middlewares("updateSetting"),
      updateSetting
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
   * get setting by user
   *
   * @abstract
   * @param {GetSettingRequest} req getSetting request
   * @returns {GetSettingResponse} Expected response to a valid request
   */
  getSetting(req) {
    throw new Error("not implemented");
  }

  /**
   * delete a setting
   *
   * @abstract
   * @param {DeleteSettingRequest} req deleteSetting request
   */
  deleteSetting(req) {
    throw new Error("not implemented");
  }

  /**
   * update a setting
   *
   * @abstract
   * @param {UpdateSettingRequest} req updateSetting request
   * @returns {UpdateSettingResponse} Expected response to a valid request
   */
  updateSetting(req) {
    throw new Error("not implemented");
  }
}
