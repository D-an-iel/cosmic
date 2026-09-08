import productService from '../services/productService.js';
import { productSchema, productUpdateSchema } from '../validators/productValidator.js';

class ProductController {
  async create(req, res, next) {
    try {
      const validatedData = productSchema.parse(req.body);
      const product = await productService.createProduct(validatedData);
      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const validatedData = productUpdateSchema.parse(req.body);
      const product = await productService.updateProduct(req.params.id, validatedData);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
