import createError from "http-errors";

import API from "../api/product";
import Product from "../models/product";

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
   * list all products
   *
   * @abstract
   * @param {ListProductsRequest} req listProducts request
   * @returns {ListProductsResponse} a paged array of products
   */
  async listProducts(req) {
    const { normalizedQuery } = req.context;

    const ret = await Product.list(normalizedQuery);

    return { body: ret.docs, headers: { xTotalCount: ret.total } };
  }

  /**
   * create a product
   *
   * @abstract
   * @param {CreateProductRequest} req createProduct request
   * @returns {CreateProductResponse} the product created
   */
  async createProduct(req) {
    const { body = {} } = req;
    const product = await Product.create(body);
    return { body: product.toJSON() };
  }

  /**
   * get product by productId
   *
   * @abstract
   * @param {GetProductRequest} req getProduct request
   * @returns {GetProductResponse} Expected response to a valid request
   */
  async getProduct(req) {
    const { productId } = req;
    const product = await Product.getByIdOrSlug(productId);

    if (!product) {
      throw createError(404, "Product not found!");
    }

    return { body: product };
  }

  /**
   * delete a product
   *
   * @abstract
   * @param {DeleteProductRequest} req deleteProduct request
   */
  async deleteProduct(req) {
    const { productId } = req;
    const product = await Product.getByIdOrSlug(productId);
    if (!product) {
      throw createError(404, "Product not found!");
    }

    await product
      .set({
        deletedAt: new Date(),
        deleted: true,
      })
      .save();
  }

  /**
   * update product
   *
   * @abstract
   * @param {UpdateProductRequest} req updateProduct request
   * @returns {UpdateProductResponse} Expected response to a valid request
   */
  async updateProduct(req) {
    const { productId, body } = req;
    const product = await Product.getByIdOrSlug(productId);
    if (!product) {
      throw createError(404, "Product not found!");
    }

    return { body: await product.set(body).save() };
  }
}

export default new Service();
