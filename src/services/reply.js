import createError from "http-errors";

import API from "../api/reply";
import Reply from "../models/reply";

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
   * list all replies
   *
   * @abstract
   * @param {ListRepliesRequest} req listReplies request
   * @returns {ListRepliesResponse} a paged array of replies
   */
  async listReplies(req) {
    const { normalizedQuery } = req.context;

    const ret = await Reply.list(normalizedQuery);

    return { body: ret.docs, headers: { xTotalCount: ret.total } };
  }

  /**
   * create a reply
   *
   * @abstract
   * @param {CreateReplyRequest} req createReply request
   * @returns {CreateReplyResponse} the reply created
   */
  async createReply(req) {
    const { body = {} } = req;
    const reply = await Reply.create(body);
    return { body: reply.toJSON() };
  }

  /**
   * get reply
   *
   * @abstract
   * @param {GetReplyRequest} req getReply request
   * @returns {GetReplyResponse} Expected response to a valid request
   */
  async getReply(req) {
    const { replyId } = req;
    const reply = await Reply.get(replyId);

    if (!reply) {
      throw createError(404, "Product not found!");
    }

    return { body: reply };
  }

  /**
   * delete a reply
   *
   * @abstract
   * @param {DeleteReplyRequest} req deleteReply request
   */
  async deleteReply(req) {
    const { replyId } = req;
    const reply = await Reply.get(replyId);
    if (!reply) {
      throw createError(404, "Product not found!");
    }

    await reply
      .set({
        deletedAt: new Date(),
        deleted: true,
      })
      .save();
  }

  /**
   * update a reply
   *
   * @abstract
   * @param {UpdateReplyRequest} req updateReply request
   * @returns {UpdateReplyResponse} Expected response to a valid request
   */
  async updateReply(req) {
    const { replyId, body } = req;
    const reply = await Reply.get(replyId);
    if (!reply) {
      throw createError(404, "Product not found!");
    }

    return { body: await reply.set(body).save() };
  }
}

export default new Service();
