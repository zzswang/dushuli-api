import createError from "http-errors";
import { pick } from "lodash";

import API from "../api/invitation";
import Invitation from "../models/invitation";

export function generateCode(length = 6) {
  const set = "0123456789";
  const setLen = set.length;

  let code = "";
  for (let i = 0; i < length; i++) {
    const p = Math.floor(Math.random() * setLen);
    code += set[p];
  }
  return code;
}

export class Service extends API {
  /**
   * Ability to inject some middlewares
   *
   * @param {string} operation name of operation
   * @returns {function[]} middlewares
   */
  middlewares(operation) {
    const load = async (ctx, next) => {
      let { invitationId } = ctx.params;
      if (invitationId) {
        ctx.state.invitation = await Invitation.getByIdOrCode(invitationId);
        if (!ctx.state.invitation) {
          throw createError(404, `invitation ${invitationId} not found.`);
        }
      }
      await next();
    };
    return [load];
  }
  /**
   * Create invitation 可以用于发送验证码/激活码/注册码等
   *
   * @param {CreateInvitationRequest} req createInvitation request
   * @returns {CreateInvitationResponse} The invitaion created
   */
  async createInvitation(req) {
    const { body } = req;
    const code = generateCode();
    const invitation = await Invitation.create({
      ...body,
      code,
    });

    return { body: invitation.toJSON() };
  }

  /**
   * List invitations
   *
   * @param {ListInvitationsRequest} req listInvitations request
   * @returns {ListInvitationsResponse} A paged array of invitations
   */
  async listInvitations(req) {
    const { query = {} } = req;
    const {
      _limit = 10,
      _offset = 0,
      ns,
      code,
      code_like,
      sub,
      used,
      phone,
    } = query;
    const result = await Invitation.list({
      limit: Number.parseInt(_limit, 10),
      offset: Number.parseInt(_offset, 10),
      filter: {
        ns,
        code,
        code_like,
        phone,
        sub,
        used,
      },
      sort: "-createdAt",
    });

    const body = result.docs.map(item => item.toObject());
    return {
      body,
      headers: {
        xTotalCount: result.total,
      },
    };
  }

  /**
   * Get invitation by id
   *
   * @param {GetInvitationRequest} req getInvitation request
   * @returns {GetInvitationResponse} The invitation with given id
   */
  async getInvitation(req) {
    const ctx = req.context;
    return { body: ctx.state.invitation };
  }

  /**
   * Update invitation
   *
   * @param {UpdateInvitationRequest} req updateInvitation request
   * @returns {UpdateInvitationResponse} The invitation
   */
  async updateInvitation(req) {
    const ctx = req.context;
    const invitation = ctx.state.invitation;
    if (!req.body.used) {
      const doc = pick(req.body, [
        "start",
        "end",
        "period",
        "comment",
        "source",
      ]);
      await invitation.set(doc).save();
    } else {
      const doc = pick(req.body, ["phone", "email", "user"]);
      await invitation.set(doc).save();
      if (req.body.usedBy) {
        await invitation.useCode(req.body.usedBy);
      }
    }
    return { body: invitation };
  }

  /**
   * delete invitation
   *
   * @param {DeleteInvitationRequest} req deleteInvitation request
   * @returns {DeleteInvitationResponse} invitation deleted
   */
  async deleteInvitation(req) {
    const ctx = req.context;
    const invitation = ctx.state.invitation;
    await invitation.delete();
  }

  /**
   * bulk upsert invitations
   *
   * @param {UpdateInvitationsRequest} req updateInvitations request
   * @returns {UpdateInvitationsResponse} The invitations be uperted
   */
  async updateInvitations(req) {
    const { body } = req;

    const invitations = await Promise.all(
      body.map(row =>
        Invitation.findOneAndUpdate(
          { $or: [{ _id: row.id }, { code: row.code }] },
          row,
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        )
      )
    );

    return { body: invitations };
  }
}

const service = new Service();
export default service;
