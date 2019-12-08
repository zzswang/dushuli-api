/// <reference path='./def.d.ts' />
import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const getWechatPushEvent = async ctx => {
      if (!ctx.query.signature)
        throw createError(400, "signature in query is required.");

      if (!ctx.query.timestamp)
        throw createError(400, "timestamp in query is required.");

      if (!ctx.query.nonce)
        throw createError(400, "nonce in query is required.");

      if (!ctx.query.encrypt_type)
        throw createError(400, "encrypt_type in query is required.");

      if (!ctx.query.msg_signature)
        throw createError(400, "msg_signature in query is required.");

      const req = {
        query: {
          signature: ctx.query.signature,
          timestamp: ctx.query.timestamp,
          nonce: ctx.query.nonce,
          encrypt_type: ctx.query.encrypt_type,
          msg_signature: ctx.query.msg_signature,
        },
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.getWechatPushEvent(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const getAuthorizerAccessToken = async ctx => {
      if (!ctx.query.auth_code)
        throw createError(400, "auth_code in query is required.");

      const req = {
        query: {
          auth_code: ctx.query.auth_code,
        },
        context: ctx, // here we put koa context in request
      };

      const res = await this.getAuthorizerAccessToken(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const getComponentVerifyTicket = async ctx => {
      if (!ctx.query.signature)
        throw createError(400, "signature in query is required.");

      if (!ctx.query.timestamp)
        throw createError(400, "timestamp in query is required.");

      if (!ctx.query.nonce)
        throw createError(400, "nonce in query is required.");

      if (!ctx.query.encrypt_type)
        throw createError(400, "encrypt_type in query is required.");

      if (!ctx.query.msg_signature)
        throw createError(400, "msg_signature in query is required.");

      const req = {
        query: {
          signature: ctx.query.signature,
          timestamp: ctx.query.timestamp,
          nonce: ctx.query.nonce,
          encrypt_type: ctx.query.encrypt_type,
          msg_signature: ctx.query.msg_signature,
        },
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.getComponentVerifyTicket(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const getPreAuthCode = async ctx => {
      const res = await this.getPreAuthCode();

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const dev = async ctx => {
      const res = await this.dev();

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

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

    router.post(
      "/wxe8fc40117734ec1f/event",
      ...this.middlewares("getWechatPushEvent"),
      getWechatPushEvent
    );
    router.get(
      "/authorizer_access_token",
      ...this.middlewares("getAuthorizerAccessToken"),
      getAuthorizerAccessToken
    );
    router.post(
      "/component_verify_ticket",
      ...this.middlewares("getComponentVerifyTicket"),
      getComponentVerifyTicket
    );
    router.get(
      "/pre_auth_code",
      ...this.middlewares("getPreAuthCode"),
      getPreAuthCode
    );
    router.get("/dev", ...this.middlewares("dev"), dev);
    router.post(
      "/wechat/payment",
      ...this.middlewares("createPayment"),
      createPayment
    );
    router.get(
      "/wechat/signature",
      ...this.middlewares("getSignature"),
      getSignature
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
   * get wechat push event
   *
   * @abstract
   * @param {GetWechatPushEventRequest} req getWechatPushEvent request
   * @returns {GetWechatPushEventResponse} Expected response to a valid request
   */
  getWechatPushEvent(req) {
    throw new Error("not implemented");
  }

  /**
   * get authorizer_access_token
   *
   * @abstract
   * @param {GetAuthorizerAccessTokenRequest} req getAuthorizerAccessToken request
   * @returns {GetAuthorizerAccessTokenResponse} Expected response to a valid request
   */
  getAuthorizerAccessToken(req) {
    throw new Error("not implemented");
  }

  /**
   * get component_verify_ticket
   *
   * @abstract
   * @param {GetComponentVerifyTicketRequest} req getComponentVerifyTicket request
   * @returns {GetComponentVerifyTicketResponse} Expected response to a valid request
   */
  getComponentVerifyTicket(req) {
    throw new Error("not implemented");
  }

  /**
   * get pre_auth_code
   *
   * @abstract
   * @returns {GetPreAuthCodeResponse} Expected response to a valid request
   */
  getPreAuthCode() {
    throw new Error("not implemented");
  }

  /**
   * dev
   *
   * @abstract
   * @returns {DevResponse} Expected response to a valid request
   */
  dev() {
    throw new Error("not implemented");
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
