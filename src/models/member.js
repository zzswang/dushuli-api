import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";

const periodSchema = new mongoose.Schema(
  {
    start: Date,
    end: Date,
    trial: Boolean,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    active: Boolean,
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

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      unique: true,
    },
    period: [periodSchema],
    active: {
      type: Boolean,
      default: true,
    },
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

class Member {
  id;
  createdAt;
  updatedAt;
  deleted;
  deletedAt;
  user;
  period;
  active;

  static async getByUser(user) {
    return await this.findOne({ user });
  }
}

memberSchema.plugin(helper);
memberSchema.loadClass(Member);

const Model = mongoose.model("Member", memberSchema);

export default Model;
