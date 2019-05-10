import createError from "http-errors";

import API from "../api/order";
import Order from "../models/order";

class Service extends API {
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
  async listOrders(req) {
    const { normalizedQuery } = req.context;

    const ret = await Order.list(normalizedQuery);

    return { body: ret.docs, headers: { xTotalCount: ret.total } };
  }

  /**
   * create a order
   *
   * @abstract
   * @param {CreateOrderRequest} req createOrder request
   * @returns {CreateOrderResponse} the order created
   */
  async createOrder(req) {
    const { body = {} } = req;
    const order = await Order.create(body);
    return { body: order.toJSON() };
  }

  /**
   * get order by orderId
   *
   * @abstract
   * @param {GetOrderRequest} req getOrder request
   * @returns {GetOrderResponse} Expected response to a valid request
   */
  async getOrder(req) {
    const { orderId } = req;
    const order = await Order.getByIdOrNo(orderId);

    if (!order) {
      throw createError(404, "Order not found!");
    }

    return { body: order };
  }

  /**
   * delete a order
   *
   * @abstract
   * @param {DeleteOrderRequest} req deleteOrder request
   */
  async deleteOrder(req) {
    const { orderId } = req;
    const order = await Order.getByIdOrNo(orderId);
    if (!order) {
      throw createError(404, "Order not found!");
    }

    await order
      .set({
        deletedAt: new Date(),
        deleted: true,
      })
      .save();
  }

  /**
   * update order
   *
   * @abstract
   * @param {UpdateOrderRequest} req updateOrder request
   * @returns {UpdateOrderResponse} Expected response to a valid request
   */
  async updateOrder(req) {
    const { orderId, body } = req;
    const order = await Order.getByIdOrNo(orderId);
    if (!order) {
      throw createError(404, "Order not found!");
    }

    return { body: await order.set(body).save() };
  }
}

export default new Service();
