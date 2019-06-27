import API from "../api/formId";
import FormId from "../models/formId";

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
   * Save formId 保存小程序 formId
   *
   * @abstract
   * @param {CreateFormIdRequest} req createFormId request
   * @returns {CreateFormIdResponse} The formId created
   */
  async createFormId(req) {
    const { body = {} } = req;
    const formId = await FormId.create(body);
    return { body: formId.toJSON() };
  }
}

export default new Service();
