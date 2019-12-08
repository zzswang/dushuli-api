import mongoose from "mongoose";
import helper from "@36node/mongoose-helper";
import { MEMBER_TYPE } from "../constants";

const periodSchema = new mongoose.Schema(
  {
    start: Date,
    end: Date,
    trial: Boolean,
    product: Object,
    order: String,
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

  get type() {
    if (this.period.length) {
      let trial;

      if (this.period.length === 1 && this.period[0].trial) {
        trial = true;
      }
      if (this.expiredAt < new Date()) {
        if (trial) {
          return MEMBER_TYPE.TRIALEXPIRE;
        }
        return MEMBER_TYPE.EXPIRE;
      }
      if (trial) {
        return MEMBER_TYPE.TRIAL;
      }
      return MEMBER_TYPE.FORMAL;
    }

    return null;
  }

  get expiredAt() {
    if (this.period.length) {
      let expiredAt;
      this.period.forEach(period => {
        if (period.active) {
          if (!expiredAt) {
            expiredAt = period.end;
          } else if (period.end > expiredAt) {
            expiredAt = period.end;
          }
        }
      });
      return expiredAt;
    }
    return null;
  }
}

memberSchema.plugin(helper);
memberSchema.loadClass(Member);

const Model = mongoose.model("Member", memberSchema);

export default Model;
