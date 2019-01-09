import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";

export const dushuliSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      unique: true,
      required: true,
    },
    holiday: String,
    solarTerm: String,
    slogan: String,
    book: String,
    author: String,
    summary: String,
    content: String,
    audio: String,
    audioUrl: String,
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
  /** @type {string} 节日 以及标语 */
  holiday;
  /** @type {string} 节气 以及标语 */
  solarTerm;
  /** @type {string} 口号 */
  slogan;
  /** @type {string} 书名 */
  book;
  /** @type {string} 作者 */
  author;
  /** @type {string} 摘要 */
  summary;
  /** @type {string} 内容详情 */
  content;
  /** @type {string} 音频 */
  audio;
  /** @type {string} 音频链接 */
  audioUrl;
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
