import productRepository from '../repositories/productRepository.js';

class ProductService {
  async createProduct(productData) {
    const existingProduct = await productRepository.findBySlug(productData.slug);
    if (existingProduct) {
      throw new Error('Product with this slug already exists');
    }
    return await productRepository.create(productData);
  }

  async getAllProducts() {
    return await productRepository.findAll();
  }

  async getProductBySlug(slug) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async updateProduct(id, updateData) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    if (updateData.slug) {
      const existingProduct = await productRepository.findBySlug(updateData.slug);
      if (existingProduct && existingProduct.id !== id) {
        throw new Error('Another product already uses this slug');
      }
    }

    return await productRepository.update(id, updateData);
  }

  async deleteProduct(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return await productRepository.delete(id);
  }
}

export default new ProductService();
