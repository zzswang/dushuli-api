import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";

import { PAYMENT_METHOD, ORDER_STATUS } from "../constants";

const orderSchema = new mongoose.Schema(
  {
    no: {
      type: String,
      unique: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    method: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD.WECHAT_PAY,
    },
    fee: Number,
    comment: String,
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.CREATED,
    },
    paidAt: Date,
    user: Object,
    data: Object,
    createdBy: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

class Order {
  id;
  createdAt;
  updatedAt;
  deleted;
  deletedAt;
  no;
  paid;
  product;
  method;
  price;
  comment;
  status;
  paidAt;
  user;
  data;
  createdBy;

  static async getByIdOrNo(orderId) {
    let order;
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      order = await this.get(orderId);
    } else {
      order = await this.findOne({ no: orderId });
    }
    return order;
  }
}

orderSchema.plugin(helper);
orderSchema.loadClass(Order);

const Model = mongoose.model("Order", orderSchema);

export default Model;
