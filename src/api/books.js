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
          _limit: ctx.query._limit,
          _sort: ctx.query._sort,
          date_gt: ctx.query.date_gt,
          date_lt: ctx.query.date_lt,
        },
        context: ctx, // here we put koa context in request
      };

      const res = await this.listBooks(req);

      if (!res.body) throw createError(500, "should have body in response");

      if (!res.headers || res.headers.xTotalCount === undefined)
        throw createError(500, "should have header X-Total-Count in response");

      ctx.body = res.body;
      ctx.set("X-Total-Count", res.headers.xTotalCount);
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
      ctx.status = 201;
    };

    const showBookByIdOrSlug = async ctx => {
      if (!ctx.params.bookIdOrSlug)
        throw createError(400, "bookIdOrSlug in path is required.");

      if (!ctx.query.identify)
        throw createError(400, "identify in query is required.");

      const req = {
        bookIdOrSlug: ctx.params.bookIdOrSlug,
        query: {
          identify: ctx.query.identify,
        },
        context: ctx, // here we put koa context in request
      };

      const res = await this.showBookByIdOrSlug(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const deleteBookByIdOrSlug = async ctx => {
      if (!ctx.params.bookIdOrSlug)
        throw createError(400, "bookIdOrSlug in path is required.");

      if (!ctx.query.identify)
        throw createError(400, "identify in query is required.");

      const req = {
        bookIdOrSlug: ctx.params.bookIdOrSlug,
        query: {
          identify: ctx.query.identify,
        },
        context: ctx, // here we put koa context in request
      };

      await this.deleteBookByIdOrSlug(req);

      ctx.status = 204;
    };

    const updateBookByIdOrSlug = async ctx => {
      if (!ctx.params.bookIdOrSlug)
        throw createError(400, "bookIdOrSlug in path is required.");

      if (!ctx.query.identify)
        throw createError(400, "identify in query is required.");

      const req = {
        bookIdOrSlug: ctx.params.bookIdOrSlug,
        query: {
          identify: ctx.query.identify,
        },
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.updateBookByIdOrSlug(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    router.get("/books", ...this.middlewares("listBooks"), listBooks);
    router.post("/books", ...this.middlewares("createBook"), createBook);
    router.get(
      "/books/:bookIdOrSlug",
      ...this.middlewares("showBookByIdOrSlug"),
      showBookByIdOrSlug
    );
    router.delete(
      "/books/:bookIdOrSlug",
      ...this.middlewares("deleteBookByIdOrSlug"),
      deleteBookByIdOrSlug
    );
    router.put(
      "/books/:bookIdOrSlug",
      ...this.middlewares("updateBookByIdOrSlug"),
      updateBookByIdOrSlug
    );
  }

  /**
   * implement following abstract methods in the inherited class
   */

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
   * Find book by id or slug
   *
   * @abstract
   * @param {ShowBookByIdOrSlugRequest} req showBookByIdOrSlug request
   * @returns {ShowBookByIdOrSlugResponse} Expected response to a valid request
   */
  showBookByIdOrSlug(req) {
    throw new Error("not implemented");
  }

  /**
   *
   *
   * @abstract
   * @param {DeleteBookByIdOrSlugRequest} req deleteBookByIdOrSlug request
   */
  deleteBookByIdOrSlug(req) {
    throw new Error("not implemented");
  }

  /**
   *
   *
   * @abstract
   * @param {UpdateBookByIdOrSlugRequest} req updateBookByIdOrSlug request
   * @returns {UpdateBookByIdOrSlugResponse} Expected response to a valid request
   */
  updateBookByIdOrSlug(req) {
    throw new Error("not implemented");
  }
}
