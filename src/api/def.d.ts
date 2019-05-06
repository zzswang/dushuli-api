interface CreatePaymentRequest {
  body: CreatePaymentBody;
  context?: Object;
}

interface CreatePaymentResponse {
  body: CreatePaymentResponse;
}

interface GetSignatureRequest {
  query: {
    url: string;
  };
  context?: Object;
}

interface GetSignatureResponse {
  body: GetSignatureResponse;
}

interface WechatPayCallbackRequest {
  body: WechatPayCallback;
  context?: Object;
}

interface WechatPayCallbackResponse {
  body: WechatPayCallbackResponse;
}

interface CreatePaymentBody {
  openid: string;
  sandbox: boolean;
}
interface CreatePaymentResponse {
  appid: string;
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}
interface GetSignatureResponse {
  debug: boolean;
  appId: string;
  timestamp: string;
  nonceStr: string;
  signature: string;
  jsApiList: Array<string>;
}
interface WechatPayCallback {
  appid: string;
}
interface Err {
  code: string;
  message: string;
}
