/// <reference path='./def.d.ts' />
import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const listReplies = async ctx => {
      const req = {
        query: {
          _select: ctx.query._select,
          _limit: ctx.query._limit,
          _offset: ctx.query._offset,
          _sort: ctx.query._sort,
          active: ctx.query.active,
        },
        context: ctx, // here we put koa context in request
      };

      const res = await this.listReplies(req);

      if (!res.body) throw createError(500, "should have body in response");

      if (!res.headers || res.headers.xTotalCount === undefined)
        throw createError(500, "should have header X-Total-Count in response");

      ctx.body = res.body;
      ctx.set("X-Total-Count", res.headers.xTotalCount);
      ctx.status = 200;
    };

    const createReply = async ctx => {
      const req = {
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.createReply(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 201;
    };

    const getReply = async ctx => {
      if (!ctx.params.replyId)
        throw createError(400, "replyId in path is required.");

      const req = {
        replyId: ctx.params.replyId,
        context: ctx, // here we put koa context in request
      };

      const res = await this.getReply(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const deleteReply = async ctx => {
      if (!ctx.params.replyId)
        throw createError(400, "replyId in path is required.");

      const req = {
        replyId: ctx.params.replyId,
        context: ctx, // here we put koa context in request
      };

      await this.deleteReply(req);

      ctx.status = 204;
    };

    const updateReply = async ctx => {
      if (!ctx.params.replyId)
        throw createError(400, "replyId in path is required.");

      const req = {
        replyId: ctx.params.replyId,
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.updateReply(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    router.get("/replies", ...this.middlewares("listReplies"), listReplies);
    router.post("/replies", ...this.middlewares("createReply"), createReply);
    router.get("/replies/:replyId", ...this.middlewares("getReply"), getReply);
    router.delete(
      "/replies/:replyId",
      ...this.middlewares("deleteReply"),
      deleteReply
    );
    router.put(
      "/replies/:replyId",
      ...this.middlewares("updateReply"),
      updateReply
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
   * list all replies
   *
   * @abstract
   * @param {ListRepliesRequest} req listReplies request
   * @returns {ListRepliesResponse} a paged array of replies
   */
  listReplies(req) {
    throw new Error("not implemented");
  }

  /**
   * create a reply
   *
   * @abstract
   * @param {CreateReplyRequest} req createReply request
   * @returns {CreateReplyResponse} the reply created
   */
  createReply(req) {
    throw new Error("not implemented");
  }

  /**
   * get reply
   *
   * @abstract
   * @param {GetReplyRequest} req getReply request
   * @returns {GetReplyResponse} Expected response to a valid request
   */
  getReply(req) {
    throw new Error("not implemented");
  }

  /**
   * delete a reply
   *
   * @abstract
   * @param {DeleteReplyRequest} req deleteReply request
   */
  deleteReply(req) {
    throw new Error("not implemented");
  }

  /**
   * update a reply
   *
   * @abstract
   * @param {UpdateReplyRequest} req updateReply request
   * @returns {UpdateReplyResponse} Expected response to a valid request
   */
  updateReply(req) {
    throw new Error("not implemented");
  }
}
