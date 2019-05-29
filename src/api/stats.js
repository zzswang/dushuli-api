/// <reference path='./def.d.ts' />
import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const createStats = async ctx => {
      const req = {
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.createStats(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const listStats = async ctx => {
      if (!ctx.query.user) throw createError(400, "user in query is required.");

      const req = {
        query: {
          _select: ctx.query._select,
          _limit: ctx.query._limit,
          _offset: ctx.query._offset,
          _sort: ctx.query._sort,
          user: ctx.query.user,
          date_gt: ctx.query.date_gt,
          date_lt: ctx.query.date_lt,
        },
        context: ctx, // here we put koa context in request
      };

      const res = await this.listStats(req);

      if (!res.body) throw createError(500, "should have body in response");

      if (!res.headers || res.headers.xTotalCount === undefined)
        throw createError(500, "should have header X-Total-Count in response");

      ctx.body = res.body;
      ctx.set("X-Total-Count", res.headers.xTotalCount);
      ctx.status = 200;
    };

    router.post("/stats", ...this.middlewares("createStats"), createStats);
    router.get("/stats", ...this.middlewares("listStats"), listStats);
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
   * create or update stats
   *
   * @abstract
   * @param {CreateStatsRequest} req createStats request
   * @returns {CreateStatsResponse} Expected response to a valid request
   */
  createStats(req) {
    throw new Error("not implemented");
  }

  /**
   * list stats
   *
   * @abstract
   * @param {ListStatsRequest} req listStats request
   * @returns {ListStatsResponse} a paged array of members
   */
  listStats(req) {
    throw new Error("not implemented");
  }
}
