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
interface Member {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: string;
  start: string;
  end: string;
  active: boolean;
}
interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  no: string;
  paid: boolean;
  product: string;
  method: string;
  paidAt: string;
  data: {};
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
interface Err {
  code: string;
  message: string;
}
