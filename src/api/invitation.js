/// <reference path='./def.d.ts' />
import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const createInvitation = async ctx => {
      const req = {
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.createInvitation(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 201;
    };

    const listInvitations = async ctx => {
      const req = {
        query: {
          _limit: ctx.query._limit,
          _offset: ctx.query._offset,
          ns: ctx.query.ns,
          sub: ctx.query.sub,
          code: ctx.query.code,
          code_like: ctx.query.code_like,
          phone: ctx.query.phone,
          used: ctx.query.used,
        },
        context: ctx, // here we put koa context in request
      };

      const res = await this.listInvitations(req);

      if (!res.body) throw createError(500, "should have body in response");

      if (!res.headers || res.headers.xTotalCount === undefined)
        throw createError(500, "should have header X-Total-Count in response");

      ctx.body = res.body;
      ctx.set("X-Total-Count", res.headers.xTotalCount);
      ctx.status = 200;
    };

    const updateInvitations = async ctx => {
      const req = {
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.updateInvitations(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const getInvitation = async ctx => {
      if (!ctx.params.invitationId)
        throw createError(400, "invitationId in path is required.");

      const req = {
        invitationId: ctx.params.invitationId,
        context: ctx, // here we put koa context in request
      };

      const res = await this.getInvitation(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const updateInvitation = async ctx => {
      if (!ctx.params.invitationId)
        throw createError(400, "invitationId in path is required.");

      const req = {
        invitationId: ctx.params.invitationId,
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.updateInvitation(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const deleteInvitation = async ctx => {
      if (!ctx.params.invitationId)
        throw createError(400, "invitationId in path is required.");

      const req = {
        invitationId: ctx.params.invitationId,
        context: ctx, // here we put koa context in request
      };

      await this.deleteInvitation(req);

      ctx.status = 204;
    };

    router.post(
      "/invitations",
      ...this.middlewares("createInvitation"),
      createInvitation
    );
    router.get(
      "/invitations",
      ...this.middlewares("listInvitations"),
      listInvitations
    );
    router.put(
      "/invitations",
      ...this.middlewares("updateInvitations"),
      updateInvitations
    );
    router.get(
      "/invitations/:invitationId",
      ...this.middlewares("getInvitation"),
      getInvitation
    );
    router.put(
      "/invitations/:invitationId",
      ...this.middlewares("updateInvitation"),
      updateInvitation
    );
    router.delete(
      "/invitations/:invitationId",
      ...this.middlewares("deleteInvitation"),
      deleteInvitation
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
   * Create invitation 可以用于发送邀请码
   *
   * @abstract
   * @param {CreateInvitationRequest} req createInvitation request
   * @returns {CreateInvitationResponse} The invitaion created
   */
  createInvitation(req) {
    throw new Error("not implemented");
  }

  /**
   * List invitations
   *
   * @abstract
   * @param {ListInvitationsRequest} req listInvitations request
   * @returns {ListInvitationsResponse} A paged array of invitations
   */
  listInvitations(req) {
    throw new Error("not implemented");
  }

  /**
   * bulk upsert invitations
   *
   * @abstract
   * @param {UpdateInvitationsRequest} req updateInvitations request
   * @returns {UpdateInvitationsResponse} The invitations be uperted
   */
  updateInvitations(req) {
    throw new Error("not implemented");
  }

  /**
   * Get invitation by id
   *
   * @abstract
   * @param {GetInvitationRequest} req getInvitation request
   * @returns {GetInvitationResponse} The invitation with given id
   */
  getInvitation(req) {
    throw new Error("not implemented");
  }

  /**
   * Update invitation
   *
   * @abstract
   * @param {UpdateInvitationRequest} req updateInvitation request
   * @returns {UpdateInvitationResponse} The invitation
   */
  updateInvitation(req) {
    throw new Error("not implemented");
  }

  /**
   * delete invitation
   *
   * @abstract
   * @param {DeleteInvitationRequest} req deleteInvitation request
   */
  deleteInvitation(req) {
    throw new Error("not implemented");
  }
}
