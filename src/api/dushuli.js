/// <reference path='./def.d.ts' />
import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const listBooks = async ctx => {
      const req = {
        query: {
          limit: ctx.query.limit,
          date_gt: ctx.query.date_gt,
          date_lt: ctx.query.date_lt,
          sort: ctx.query.sort,
          order: ctx.query.order,
        },
        context: ctx, // here we put koa context in request
      };

      const res = await this.listBooks(req);

      if (!res.body) throw createError(500, "should have body in response");

      if (!res.headers.xNext)
        throw createError(500, "should have header x-next in response");

      ctx.body = res.body;
      ctx.set("x-next", res.headers.xNext);
      ctx.status = 200;
    };

    const createBook = async ctx => {
      const req = {
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.createBook(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const showBookById = async ctx => {
      if (!ctx.params.bookId)
        throw createError(400, "bookId in path is required.");

      const req = {
        bookId: ctx.params.bookId,
        context: ctx, // here we put koa context in request
      };

      const res = await this.showBookById(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const deleteBookById = async ctx => {
      if (!ctx.params.bookId)
        throw createError(400, "bookId in path is required.");

      const req = {
        bookId: ctx.params.bookId,
        context: ctx, // here we put koa context in request
      };

      const res = await this.deleteBookById(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const updateBookById = async ctx => {
      if (!ctx.params.bookId)
        throw createError(400, "bookId in path is required.");

      const req = {
        bookId: ctx.params.bookId,
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.updateBookById(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    router.get("/books", this.authorize("listBooks"), listBooks);
    router.post("/books", this.authorize("createBook"), createBook);
    router.get("/books/:bookId", this.authorize("showBookById"), showBookById);
    router.delete(
      "/books/:bookId",
      this.authorize("deleteBookById"),
      deleteBookById
    );
    router.put(
      "/books/:bookId",
      this.authorize("updateBookById"),
      updateBookById
    );
  }

  /**
   * implement following abstract methods in the inherited class
   */

  /**
   * Authorize current operation
   * rewrite it if you want to control operation permission
   *
   * @param {string} operation name of operation
   */
  authorize(operation) {
    return (ctx, next) => {
      return next();
    };
  }

  /**
   * List all books
   *
   * @abstract
   * @param {ListBooksRequest} req listBooks request
   * @returns {ListBooksResponse} A paged array of books
   */
  listBooks(req) {
    throw new Error("not implemented");
  }

  /**
   * Create a book
   *
   * @abstract
   * @param {CreateBookRequest} req createBook request
   * @returns {CreateBookResponse} The Book created
   */
  createBook(req) {
    throw new Error("not implemented");
  }

  /**
   * Find book by id
   *
   * @abstract
   * @param {ShowBookByIdRequest} req showBookById request
   * @returns {ShowBookByIdResponse} Expected response to a valid request
   */
  showBookById(req) {
    throw new Error("not implemented");
  }

  /**
   * delete book by id
   *
   * @abstract
   * @param {DeleteBookByIdRequest} req deleteBookById request
   * @returns {DeleteBookByIdResponse} Expected response to a valid request
   */
  deleteBookById(req) {
    throw new Error("not implemented");
  }

  /**
   * update book by id
   *
   * @abstract
   * @param {UpdateBookByIdRequest} req updateBookById request
   * @returns {UpdateBookByIdResponse} Expected response to a valid request
   */
  updateBookById(req) {
    throw new Error("not implemented");
  }
}
