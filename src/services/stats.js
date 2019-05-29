/// <reference path='./def.d.ts' />
// import createError from "http-errors";

import API from "../api/stats";
import Stats from "../models/stats";

class Service extends API {
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
  async createStats(req) {
    const { body } = req;
    const { user, date } = body;

    const stats = await Stats.findOneAndUpdate(
      {
        user,
        date,
      },
      {
        ...body,
        deleted: false,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    return { body: stats.toJSON() };
  }

  /**
   * list stats
   *
   * @abstract
   * @param {ListStatsRequest} req listStats request
   * @returns {ListStatsResponse} a paged array of members
   */
  async listStats(req) {
    const { normalizedQuery } = req.context;

    const ret = await Stats.list(normalizedQuery);

    return { body: ret.docs, headers: { xTotalCount: ret.total } };
  }
}

export default new Service();
