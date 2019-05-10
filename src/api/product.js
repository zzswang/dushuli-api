/// <reference path='./def.d.ts' />
import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const listProducts = async ctx => {
      const req = {
        query: {
          _select: ctx.query._select,
          _limit: ctx.query._limit,
          _offset: ctx.query._offset,
          _sort: ctx.query._sort,
          published: ctx.query.published,
        },
        context: ctx, // here we put koa context in request
      };

      const res = await this.listProducts(req);

      if (!res.body) throw createError(500, "should have body in response");

      if (!res.headers || res.headers.xTotalCount === undefined)
        throw createError(500, "should have header X-Total-Count in response");

      ctx.body = res.body;
      ctx.set("X-Total-Count", res.headers.xTotalCount);
      ctx.status = 200;
    };

    const createProduct = async ctx => {
      const req = {
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.createProduct(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 201;
    };

    const getProduct = async ctx => {
      if (!ctx.params.productId)
        throw createError(400, "productId in path is required.");

      const req = {
        productId: ctx.params.productId,
        context: ctx, // here we put koa context in request
      };

      const res = await this.getProduct(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const deleteProduct = async ctx => {
      if (!ctx.params.productId)
        throw createError(400, "productId in path is required.");

      const req = {
        productId: ctx.params.productId,
        context: ctx, // here we put koa context in request
      };

      await this.deleteProduct(req);

      ctx.status = 204;
    };

    const updateProduct = async ctx => {
      if (!ctx.params.productId)
        throw createError(400, "productId in path is required.");

      const req = {
        productId: ctx.params.productId,
        body: ctx.request.body,
        context: ctx, // here we put koa context in request
      };

      const res = await this.updateProduct(req);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    router.get("/products", ...this.middlewares("listProducts"), listProducts);
    router.post(
      "/products",
      ...this.middlewares("createProduct"),
      createProduct
    );
    router.get(
      "/products/:productId",
      ...this.middlewares("getProduct"),
      getProduct
    );
    router.delete(
      "/products/:productId",
      ...this.middlewares("deleteProduct"),
      deleteProduct
    );
    router.put(
      "/products/:productId",
      ...this.middlewares("updateProduct"),
      updateProduct
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
   * list all products
   *
   * @abstract
   * @param {ListProductsRequest} req listProducts request
   * @returns {ListProductsResponse} a paged array of products
   */
  listProducts(req) {
    throw new Error("not implemented");
  }

  /**
   * create a product
   *
   * @abstract
   * @param {CreateProductRequest} req createProduct request
   * @returns {CreateProductResponse} the product created
   */
  createProduct(req) {
    throw new Error("not implemented");
  }

  /**
   * get product by productId
   *
   * @abstract
   * @param {GetProductRequest} req getProduct request
   * @returns {GetProductResponse} Expected response to a valid request
   */
  getProduct(req) {
    throw new Error("not implemented");
  }

  /**
   * delete a product
   *
   * @abstract
   * @param {DeleteProductRequest} req deleteProduct request
   */
  deleteProduct(req) {
    throw new Error("not implemented");
  }

  /**
   * update product
   *
   * @abstract
   * @param {UpdateProductRequest} req updateProduct request
   * @returns {UpdateProductResponse} Expected response to a valid request
   */
  updateProduct(req) {
    throw new Error("not implemented");
  }
}
