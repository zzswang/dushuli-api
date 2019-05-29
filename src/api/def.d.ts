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

interface ListMembersRequest {
  query: {
    _select?: string;
    _limit?: number;
    _offset?: string;
    _sort?: string;
    users?: string;
    active?: boolean;
  };
  context?: Object;
}

interface ListMembersResponse {
  body: Array<Member>;
  headers: {
    xTotalCount: string;
  };
}

interface CreateMemberRequest {
  body: Member;
  context?: Object;
}

interface CreateMemberResponse {
  body: Member;
}

interface GetMemberRequest {
  user: string;
  context?: Object;
}

interface GetMemberResponse {
  body: Member;
}

interface DeleteMemberRequest {
  user: string;
  context?: Object;
}

interface UpdateMemberRequest {
  user: string;
  body: Member;
  context?: Object;
}

interface UpdateMemberResponse {
  body: Member;
}

interface ListProductsRequest {
  query: {
    _select?: string;
    _limit?: number;
    _offset?: string;
    _sort?: string;
    published?: boolean;
  };
  context?: Object;
}

interface ListProductsResponse {
  body: Array<Product>;
  headers: {
    xTotalCount: string;
  };
}

interface CreateProductRequest {
  body: Product;
  context?: Object;
}

interface CreateProductResponse {
  body: Product;
}

interface GetProductRequest {
  productId: string;
  context?: Object;
}

interface GetProductResponse {
  body: Product;
}

interface DeleteProductRequest {
  productId: string;
  context?: Object;
}

interface UpdateProductRequest {
  productId: string;
  body: Product;
  context?: Object;
}

interface UpdateProductResponse {
  body: Product;
}

interface ListOrdersRequest {
  query: {
    _select?: string;
    _limit?: number;
    _offset?: string;
    _sort?: string;
    _populate?: string;
    paid?: boolean;
    method?: string;
    createdBy?: string;
  };
  context?: Object;
}

interface ListOrdersResponse {
  body: Array<Order>;
  headers: {
    xTotalCount: string;
  };
}

interface CreateOrderRequest {
  body: Order;
  context?: Object;
}

interface CreateOrderResponse {
  body: Order;
}

interface GetOrderRequest {
  orderId: string;
  context?: Object;
}

interface GetOrderResponse {
  body: Order;
}

interface DeleteOrderRequest {
  orderId: string;
  context?: Object;
}

interface UpdateOrderRequest {
  orderId: string;
  body: Order;
  context?: Object;
}

interface UpdateOrderResponse {
  body: Order;
}

interface GetSettingRequest {
  user: string;
  context?: Object;
}

interface GetSettingResponse {
  body: Setting;
}

interface DeleteSettingRequest {
  user: string;
  context?: Object;
}

interface UpdateSettingRequest {
  user: string;
  body: Setting;
  context?: Object;
}

interface UpdateSettingResponse {
  body: Setting;
}

interface CreateStatsRequest {
  body: Stats;
  context?: Object;
}

interface CreateStatsResponse {
  body: Stats;
}

interface ListStatsRequest {
  query: {
    _select?: string;
    _limit?: number;
    _offset?: string;
    _sort?: string;
    user: string;
    date_gt?: string;
    date_lt?: string;
  };
  context?: Object;
}

interface ListStatsResponse {
  body: Array<Member>;
  headers: {
    xTotalCount: string;
  };
}

interface StatsData {
  value: number;
}
interface Stats {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: string;
  date: string;
  data: {
    value: number;
  };
}
interface CreatePaymentBody {
  openid: string;
  product: string;
  user: {};
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
interface Period {
  start: string;
  end: string;
  trial: boolean;
  product: string;
  active: string;
}
interface Member {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: string;
  period: Array<{
    start: string;
    end: string;
    trial: boolean;
    product: string;
    active: string;
  }>;
  active: boolean;
}
interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  no: string;
  product: string;
  method: string;
  paidAt: string;
  data: {};
  user: {};
  status: string;
  comment: string;
  fee: number;
  createdBy: string;
}
interface Product {
  id: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  price: number;
  name: string;
  description: string;
  start: string;
  end: string;
  period: number;
  published: boolean;
  publishedAt: string;
}
interface Setting {
  user: string;
  birthday: string;
  alarm: string;
}
interface Err {
  code: string;
  message: string;
}
