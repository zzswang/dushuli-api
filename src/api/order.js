/// <reference path='./def.d.ts' />
import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const listOrders = async ctx => {
      const req = {
        query: {
          _select: ctx.query._select,
          _limit: ctx.query._limit,
          _offset: ctx.query._offset,
          _sort: ctx.query._sort,
          _populate: ctx.query._populate,
          paid: ctx.query.paid,
          method: ctx.query.method,
          createdBy: ctx.query.createdBy,
        },
        context: ctx, // here we put koa context in request
      };

      const res = await this.listOrders(req);

      if (!res.body) throw createError(500, "should have body in response");

      if (!res.headers || res.headers.xTotalCount === undefined)
        throw createError(500, "should have header X-Total-Count in response");

      ctx.body = res.body;
      ctx.set("X-Total-Count", res.headers.xTotalCount);
      ctx.status = 200;
    };

    const createOrder = async ctx => {
      const req = {
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.createOrder(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 201;
    };

    const getOrder = async ctx => {
      if (!ctx.params.orderId)
        throw createError(400, "orderId in path is required.");

      const req = {
        orderId: ctx.params.orderId,
        context: ctx, // here we put koa context in request
      };

      const res = await this.getOrder(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const deleteOrder = async ctx => {
      if (!ctx.params.orderId)
        throw createError(400, "orderId in path is required.");

      const req = {
        orderId: ctx.params.orderId,
        context: ctx, // here we put koa context in request
      };

      await this.deleteOrder(req);

      ctx.status = 204;
    };

    const updateOrder = async ctx => {
      if (!ctx.params.orderId)
        throw createError(400, "orderId in path is required.");

      const req = {
        orderId: ctx.params.orderId,
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.updateOrder(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    router.get("/orders", ...this.middlewares("listOrders"), listOrders);
    router.post("/orders", ...this.middlewares("createOrder"), createOrder);
    router.get("/orders/:orderId", ...this.middlewares("getOrder"), getOrder);
    router.delete(
      "/orders/:orderId",
      ...this.middlewares("deleteOrder"),
      deleteOrder
    );
    router.put(
      "/orders/:orderId",
      ...this.middlewares("updateOrder"),
      updateOrder
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
   * list all orders
   *
   * @abstract
   * @param {ListOrdersRequest} req listOrders request
   * @returns {ListOrdersResponse} a paged array of orders
   */
  listOrders(req) {
    throw new Error("not implemented");
  }

  /**
   * create a order
   *
   * @abstract
   * @param {CreateOrderRequest} req createOrder request
   * @returns {CreateOrderResponse} the order created
   */
  createOrder(req) {
    throw new Error("not implemented");
  }

  /**
   * get order by orderId
   *
   * @abstract
   * @param {GetOrderRequest} req getOrder request
   * @returns {GetOrderResponse} Expected response to a valid request
   */
  getOrder(req) {
    throw new Error("not implemented");
  }

  /**
   * delete a order
   *
   * @abstract
   * @param {DeleteOrderRequest} req deleteOrder request
   */
  deleteOrder(req) {
    throw new Error("not implemented");
  }

  /**
   * update order
   *
   * @abstract
   * @param {UpdateOrderRequest} req updateOrder request
   * @returns {UpdateOrderResponse} Expected response to a valid request
   */
  updateOrder(req) {
    throw new Error("not implemented");
  }
}
