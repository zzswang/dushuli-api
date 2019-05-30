import createError from "http-errors";

import API from "../api/member";
import Member from "../models/member";

class Service extends API {
  /**
   * Ability to inject some middlewares
   *
   * @param {string} operation name of operation
   * @returns {function[]} middlewares
   */
  middlewares(operation) {
    return [];
  }

  /**
   * list all members
   *
   * @abstract
   * @param {ListMembersRequest} req listMembers request
   * @returns {ListMembersResponse} a paged array of members
   */
  async listMembers(req) {
    const { normalizedQuery } = req.context;

    // filter by users
    if (
      normalizedQuery &&
      normalizedQuery.filter &&
      normalizedQuery.filter["users[]"]
    ) {
      normalizedQuery.filter.user = {
        $in: normalizedQuery.filter["users[]"],
      };

      delete normalizedQuery.filter["users[]"];
    }

    if (
      normalizedQuery &&
      normalizedQuery.filter &&
      normalizedQuery.filter["users"]
    ) {
      normalizedQuery.filter.user = normalizedQuery.filter["users"];
      delete normalizedQuery.filter["users"];
    }

    const ret = await Member.list(normalizedQuery);

    return { body: ret.docs, headers: { xTotalCount: ret.total } };
  }

  /**
   * create a member
   *
   * @abstract
   * @param {CreateMemberRequest} req createMember request
   * @returns {CreateMemberResponse} the member created
   */
  async createMember(req) {
    const { body = {} } = req;
    const member = await Member.create(body);
    return { body: member.toJSON() };
  }

  /**
   * get member by user
   *
   * @abstract
   * @param {GetMemberRequest} req getMember request
   * @returns {GetMemberResponse} Expected response to a valid request
   */
  async getMember(req) {
    const { user } = req;
    const member = await Member.getByUser(user);

    return { body: member || {} };
  }

  /**
   * delete a member
   *
   * @abstract
   * @param {DeleteMemberRequest} req deleteMember request
   */
  async deleteMember(req) {
    const { user } = req;
    const member = await Member.getByUser(user);
    if (!member) {
      throw createError(404, "Member not found!");
    }

    await member
      .set({
        deletedAt: new Date(),
        deleted: true,
      })
      .save();
  }

  /**
   * update a member
   *
   * @abstract
   * @param {UpdateMemberRequest} req updateMember request
   * @returns {UpdateMemberResponse} Expected response to a valid request
   */
  async updateMember(req) {
    const { user, body } = req;
    const member = await Member.getByUser(user);
    if (!member) {
      throw createError(404, "Member not found!");
    }

    return { body: await member.set(body).save() };
  }
}

export default new Service();
