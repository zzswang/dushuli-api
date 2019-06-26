import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";
import Member from "./member";
import moment from "moment";

export const invitationSchema = new mongoose.Schema(
  {
    code: { type: String, hideJSON: true },
    email: {
      type: String,
      faker: "internet.email",
    },
    expireAt: Date,
    phone: {
      type: String,
      faker: "phone.phoneNumber",
    },
    period: Number,
    start: Date,
    end: Date,
    used: { type: Boolean, default: false },
    usedAt: Date,
    usedBy: String,
    source: String,
    comment: String,
    user: Object,
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

class Invitation {
  /** @type {string} 命名空间 */
  ns;
  /** @type {string} 验证码 */
  code;
  /** @type {string} 邮箱 */
  email;
  /** @type {Date} 验证码过期时间 */
  expireAt;
  /** @type {string} 手机 */
  phone;
  /** @type {Number} 该邀请码生效后，发生作用的有效期, 例如激活码，代表激活用户的时长 */
  period;
  /** @type {Date} 该邀请码生效后，发生作用的有效期的开始时间 */
  start;
  /** @type {Date} 该邀请码生效后，发生作用的有效期的结束时间 */
  end;
  /** @type {Date} 该邀请码是否已被使用 */
  used;
  /** @type {Date} 该邀请码的使用日期 */
  usedAt;
  /** @type {Date} 使用用该邀请码的用户 id */
  usedBy;
  /** @type {string} 渠道 */
  source;
  /** @type {string} 备注 */
  comment;
  /** @type {Date} 使用用该邀请码的用户对象 */
  user;

  static async getByIdOrCode(id) {
    let invitation;
    if (mongoose.Types.ObjectId.isValid(id)) {
      invitation = await this.get(id);
    } else {
      invitation = await this.findOne({ code: id, used: false });
    }
    return invitation;
  }

  checkCode(code) {
    return this.code === code;
  }

  async useCode(usedBy) {
    if (this.used) {
      throw new Error("invitation code has been used");
    }
    this.used = true;
    this.usedAt = new Date();
    this.usedBy = usedBy;
    await this.save();

    let member = null;
    let period = null;
    let start = null;
    let end = null;
    member = await Member.findOne({ user: usedBy, active: true });
    if (!member) {
      member = {
        user: usedBy,
        active: true,
        period: [],
      };
    }
    if (this.start && this.end) {
      start = this.start;
      end = this.end;
    } else if (this.period) {
      start = new Date();
      start = member.period.reduce((cur, next) => {
        if (next.end > cur && next.active) {
          return next.end;
        }
        return cur;
      }, start);
      end = moment(start).add(this.period, "milliseconds");
    }

    if (start && end) {
      period = {
        start,
        end,
        trial: false,
        product: {
          name: `邀请码 ${this.code}`,
        },
        active: true,
      };
      member.period.push(period);
      if (member.id) {
        await member.save();
      } else {
        Member.create(member);
      }
    }
  }
}

/**
 * output
 */
invitationSchema.loadClass(Invitation);
invitationSchema.plugin(helper);

/**
 * @typedef {mongoose.Document & Invitation} InvitationDocument
 */

/**
 * @type {mongoose.Model<InvitationDocument>}
 */
let Model = mongoose.model("Invitation", invitationSchema);

export default Model;
