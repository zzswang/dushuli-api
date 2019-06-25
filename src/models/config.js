import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";

const configSchema = new mongoose.Schema(
  {
    key: String,
    value: String,
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

class State {
  id;
  createdAt;
  updatedAt;
  deleted;
  deletedAt;
  key;
  value;
}

configSchema.plugin(helper);
configSchema.loadClass(State);

const Model = mongoose.model("Config", configSchema);

export default Model;
