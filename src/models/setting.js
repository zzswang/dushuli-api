import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";

const settingSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      unique: true,
    },
    birthday: String,
    alarm: String,
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

class Setting {
  id;
  createdAt;
  updatedAt;
  deleted;
  deletedAt;
  user;
  birthday;
  alarm;

  static async getByUser(user) {
    return await this.findOne({ user });
  }
}

settingSchema.plugin(helper);
settingSchema.loadClass(Setting);

const Model = mongoose.model("Setting", settingSchema);

export default Model;
