import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";

export const dushuliSchema = new mongoose.Schema(
  {
    date: Date,
    holiday: String,
    solarTerm: String,
    book: String,
    author: String,
    summary: String,
    content: String,
    audio: String,
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

class Dushuli {
  /** @type {date} */
  date;
  /** @type {string} */
  holiday;
  /** @type {string} */
  solarTerm;
  /** @type {string} */
  book;
  /** @type {string} */
  author;
  /** @type {string} */
  summary;
  /** @type {string} */
  content;
  /** @type {string} */
  audio;
}

/**
 * output
 */
dushuliSchema.loadClass(Dushuli);
dushuliSchema.plugin(helper);

/**
 * @typedef {mongoose.Document & Pet} DushuliDocument
 */

/**
 * @type {mongoose.Model<DushuliDocument>}
 */
let Model = mongoose.model("Dushuli", dushuliSchema);

export default Model;
