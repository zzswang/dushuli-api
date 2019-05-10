import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";

import { PAYMENT_METHOD } from "../constants.js";

const orderSchema = new mongoose.Schema(
  {
    no: {
      type: String,
      unique: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    method: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD.WECHAT_PAY,
    },
    paidAt: Date,
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
  paidAt;
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
