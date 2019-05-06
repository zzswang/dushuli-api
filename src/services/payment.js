import API from "../api/payment";
import { wechatPayApi, wechatPaySandbox } from "../wechat";

export class Service extends API {
  /**
   * initiate a payment process
   *
   * @abstract
   * @param {CreatePaymentRequest} req createPayment request
   * @returns {CreatePaymentResponse} Expected response to a valid request
   */
  async createPayment(req) {
    const { openid, sandbox, description, fee } = req.body;

    const api = sandbox ? wechatPaySandbox : wechatPayApi;

    const outTradeNo = `${new Date().valueOf()}${Math.round(
      Math.random() * 10000
    )}`;

    const params = await api.getPayParams({
      out_trade_no: outTradeNo,
      body: description || "读书历会员",
      total_fee: fee || "1",
      openid: openid,
    });
    return { body: params };
  }
}

export default new Service();
