/// <reference path='./def.d.ts' />
import createError from "http-errors";

import API from "../api/setting";
import Setting from "../models/setting";

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
   * get setting by user
   *
   * @abstract
   * @param {GetSettingRequest} req getSetting request
   * @returns {GetSettingResponse} Expected response to a valid request
   */
  async getSetting(req) {
    const { user } = req;

    const setting = await Setting.getByUser(user);

    return { body: setting || {} };
  }

  /**
   * delete a setting
   *
   * @abstract
   * @param {DeleteSettingRequest} req deleteSetting request
   */
  async deleteSetting(req) {
    const { user } = req;
    const setting = await Setting.getByUser(user);
    if (!setting) {
      throw createError(404, "Setting not found!");
    }

    await setting
      .set({
        deletedAt: new Date(),
        deleted: true,
      })
      .save();
  }

  /**
   * update a setting
   *
   * @abstract
   * @param {UpdateSettingRequest} req updateSetting request
   * @returns {UpdateSettingResponse} Expected response to a valid request
   */
  async updateSetting(req) {
    const { user, body } = req;

    const setting = await Setting.findOneAndUpdate(
      {
        user,
      },
      {
        user,
        ...body,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return { body: setting };
  }
}

export default new Service();
