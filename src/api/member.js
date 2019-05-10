/// <reference path='./def.d.ts' />
import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const listMembers = async ctx => {
      const req = {
        query: {
          _select: ctx.query._select,
          _limit: ctx.query._limit,
          _offset: ctx.query._offset,
          _sort: ctx.query._sort,
          users: ctx.query.users,
          active: ctx.query.active,
        },
        context: ctx, // here we put koa context in request
      };

      const res = await this.listMembers(req);

      if (!res.body) throw createError(500, "should have body in response");

      if (!res.headers || res.headers.xTotalCount === undefined)
        throw createError(500, "should have header X-Total-Count in response");

      ctx.body = res.body;
      ctx.set("X-Total-Count", res.headers.xTotalCount);
      ctx.status = 200;
    };

    const createMember = async ctx => {
      const req = {
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.createMember(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 201;
    };

    const getMember = async ctx => {
      if (!ctx.params.user) throw createError(400, "user in path is required.");

      const req = {
        user: ctx.params.user,
        context: ctx, // here we put koa context in request
      };

      const res = await this.getMember(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const deleteMember = async ctx => {
      if (!ctx.params.user) throw createError(400, "user in path is required.");

      const req = {
        user: ctx.params.user,
        context: ctx, // here we put koa context in request
      };

      await this.deleteMember(req);

      ctx.status = 204;
    };

    const updateMember = async ctx => {
      if (!ctx.params.user) throw createError(400, "user in path is required.");

      const req = {
        user: ctx.params.user,
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.updateMember(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    router.get("/members", ...this.middlewares("listMembers"), listMembers);
    router.post("/members", ...this.middlewares("createMember"), createMember);
    router.get("/members/:user", ...this.middlewares("getMember"), getMember);
    router.delete(
      "/members/:user",
      ...this.middlewares("deleteMember"),
      deleteMember
    );
    router.put(
      "/members/:user",
      ...this.middlewares("updateMember"),
      updateMember
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
   * list all members
   *
   * @abstract
   * @param {ListMembersRequest} req listMembers request
   * @returns {ListMembersResponse} a paged array of members
   */
  listMembers(req) {
    throw new Error("not implemented");
  }

  /**
   * create a member
   *
   * @abstract
   * @param {CreateMemberRequest} req createMember request
   * @returns {CreateMemberResponse} the member created
   */
  createMember(req) {
    throw new Error("not implemented");
  }

  /**
   * get member by user
   *
   * @abstract
   * @param {GetMemberRequest} req getMember request
   * @returns {GetMemberResponse} Expected response to a valid request
   */
  getMember(req) {
    throw new Error("not implemented");
  }

  /**
   * delete a member
   *
   * @abstract
   * @param {DeleteMemberRequest} req deleteMember request
   */
  deleteMember(req) {
    throw new Error("not implemented");
  }

  /**
   * update a member
   *
   * @abstract
   * @param {UpdateMemberRequest} req updateMember request
   * @returns {UpdateMemberResponse} Expected response to a valid request
   */
  updateMember(req) {
    throw new Error("not implemented");
  }
}
