import API from "../api/dushuli";
import Dushuli from "../models/dushuli";
import CheckRoleMiddleware from "../lib/CheckRoleMiddleware";

export class Service extends API {
  middlewares(operation) {
    if (
      ["createBook", "updateBookByIdOrSlug", "deleteBookByIdOrSlug"].includes(
        operation
      )
    ) {
      return [CheckRoleMiddleware];
    }
    return [];
  }

  /**
   * List all books
   *
   * @param {ListBooksRequest} req listBooks request
   * @returns {ListBooksResponse} A paged array of books
   */

  async listBooks(req) {
    const _limit = Number(req.query._limit) || 100;
    const _sort = req.query._sort;
    const date_gt = req.query.date_gt;
    const date_lt = req.query.date_lt;
    let sort = _sort ? _sort : "-updatedAt";

    const result = await Dushuli.list({
      limit: _limit,
      filter: { date_gt, date_lt },
      sort,
    });
    return {
      body: result.docs,
      headers: { xTotalCount: result.total },
    };
  }

  /**
   * Create a book
   *
   * @param {CreateBookRequest} req createBook request
   * @returns {CreateBookResponse} The Book created
   */

  async createBook(req) {
    const { body } = req;
    const book = await Dushuli.create(body);
    return { body: book };
  }

  /**
   * Find book by id or slug
   *
   * @param {showBookByIdOrSlugRequest} req showBookByIdOrSlug request
   * @returns {showBookByIdOrSlugResponse} Expected response to a valid request
   */

  async showBookByIdOrSlug(req) {
    const { bookIdOrSlug } = req;
    const identify = req.query.identify;

    const book =
      identify === "slug"
        ? await Dushuli.findOne({
            date: bookIdOrSlug,
          })
        : await Dushuli.get(bookIdOrSlug);

    return { body: book };
  }

  /**
   * delete book by id or slug
   *
   * @param {DeleteBookByIdRequest} req deleteBookById request
   * @returns {DeleteBookByIdResponse} Expected response to a valid request
   */
  async deleteBookByIdOrSlug(req) {
    const { bookIdOrSlug } = req;
    const identify = req.query.identify;

    const book =
      identify === "slug"
        ? await Dushuli.findOneAndDelete({
            date: bookIdOrSlug,
          })
        : await Dushuli.findOneAndDelete(bookIdOrSlug);

    return { body: book };
  }

  /**
   * update book by id or slug
   *
   * @param {UpdateBookByIdRequest} req updateBookById request
   * @returns {UpdateBookByIdResponse} Expected response to a valid request
   */
  async updateBookByIdOrSlug(req) {
    const { bookIdOrSlug, body } = req;
    const identify = req.query.identify;

    const book =
      identify === "slug"
        ? await Dushuli.findOneAndUpdate(
            {
              date: bookIdOrSlug,
            },
            body,
            {
              new: true,
            }
          )
        : await Dushuli.findOneAndUpdate(bookIdOrSlug, body, { new: true });

    return { body: book };
  }
}

const service = new Service();
export default service;
