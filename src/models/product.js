import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";

const priceItemSchema = new mongoose.Schema({
  purchaseStart: Date,
  purchaseEnd: Date,
  period: Number,
  start: Date,
  end: Date,
  price: Number,
});

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    priceItems: {
      type: [priceItemSchema],
      default: [],
    },
    name: String,
    description: String,
    originalPrice: Number,
    published: Boolean,
    publishedAt: Date,
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

class Product {
  id;
  createdAt;
  updatedAt;
  deleted;
  deletedAt;
  slug;
  priceItems;
  originalPrice;
  name;
  description;
  published;
  publishedAt;

  static async getByIdOrSlug(productId) {
    let product;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await this.get(productId);
    } else {
      product = await this.findOne({ slug: productId });
    }
    return product;
  }

  get price() {
    const item = this.priceItems.find(
      item => item.purchaseStart <= Date.now() && item.purchaseEnd >= Date.now()
    );
    return item ? item.price : 0;
  }

  get period() {
    const item = this.priceItems.find(
      item => item.purchaseStart <= Date.now() && item.purchaseEnd >= Date.now()
    );
    return item ? item.period : 0;
  }

  get start() {
    const item = this.priceItems.find(
      item => item.purchaseStart <= Date.now() && item.purchaseEnd >= Date.now()
    );
    return item ? item.start : null;
  }

  get end() {
    const item = this.priceItems.find(
      item => item.purchaseStart <= Date.now() && item.purchaseEnd >= Date.now()
    );
    return item ? item.end : null;
  }
}

productSchema.plugin(helper);
productSchema.loadClass(Product);

const Model = mongoose.model("Product", productSchema);

export default Model;
