import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";

const statsDataSchema = new mongoose.Schema(
  {
    value: Number, // 音频播放进度
  },
  {
    _id: false,
  }
);

const stateSchema = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    data: statsDataSchema,
    date: String,
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
  user;
  data;
  date;
}

stateSchema.plugin(helper);
stateSchema.loadClass(State);

const Model = mongoose.model("State", stateSchema);

export default Model;
