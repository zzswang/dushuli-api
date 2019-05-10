import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    price: Number,
    name: String,
    description: String,
    start: Date,
    end: Date,
    period: Number,
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
  price;
  name;
  description;
  start;
  end;
  period;
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
}

productSchema.plugin(helper);
productSchema.loadClass(Product);

const Model = mongoose.model("Product", productSchema);

export default Model;
