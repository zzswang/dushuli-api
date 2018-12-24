import API from "../api/dushuli";
import Dushuli from "../models/dushuli";

export class Service extends API {
  /**
   * List all books
   *
   * @param {ListBooksRequest} req listBooks request
   * @returns {ListBooksResponse} A paged array of books
   */

  async listBooks(req) {
    const limit = Number(req.query.limit) || 100;
    const date_gt = req.query.date_gt;
    const date_lt = req.query.date_lt;
    const _sort = req.query.sort;
    const _order = req.query.order;
    let sort = { updatedAt: -1 };

    if (_sort && _order) {
      sort = {};
      sort[_sort] = _order;
    }

    const result = await Dushuli.list({
      limit,
      filter: { date_gt, date_lt },
      sort,
    });
    return {
      body: result.docs,
      headers: {
        xNext: "nextLink",
      },
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
   * Find book by id
   *
   * @param {ShowBookByIdRequest} req showBookById request
   * @returns {ShowBookByIdResponse} Expected response to a valid request
   */

  async showBookById(req) {
    const { bookId } = req;
    const book = await Dushuli.get(bookId);
    return { body: book };
  }

  /**
   * delete book by id
   *
   * @param {DeleteBookByIdRequest} req deleteBookById request
   * @returns {DeleteBookByIdResponse} Expected response to a valid request
   */
  async deleteBookById(req) {
    const { bookId } = req;
    const book = await Dushuli.findOneAndDelete(bookId);
    return { body: book };
  }

  /**
   * update book by id
   *
   * @param {UpdateBookByIdRequest} req updateBookById request
   * @returns {UpdateBookByIdResponse} Expected response to a valid request
   */
  async updateBookById(req) {
    const { bookId, body } = req;
    const book = await Dushuli.findOneAndUpdate(bookId, body, { new: true });
    return { body: book };
  }
}

const service = new Service();
export default service;
