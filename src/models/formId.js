import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";

const formIdSchema = new mongoose.Schema(
  {
    formId: String,
    used: {
      type: Boolean,
      default: false,
    },
    user: String,
    expiredAt: { type: Date, index: { expires: "7d" } },
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

class FormId {
  id;
  createdAt;
  updatedAt;
  deleted;
  deletedAt;

  formId;
  user;
  used;

  useFormId() {
    this.used = true;
    return this.save();
  }
}

formIdSchema.plugin(helper);
formIdSchema.loadClass(FormId);

const Model = mongoose.model("FormId", formIdSchema);

export default Model;
