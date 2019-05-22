import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";

const configSchema = new mongoose.Schema(
  {
    autoReply: {
      type: String,
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

class Config {
  id;
  createdAt;
  updatedAt;
  deleted;
  deletedAt;

  autoReply;
  active;
}

configSchema.plugin(helper);
configSchema.loadClass(Config);

const Model = mongoose.model("Config", configSchema);

export default Model;
