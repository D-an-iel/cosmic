import wishlistRepository from '../repositories/wishlistRepository.js';
import prisma from '../db.js';

class WishlistService {
  async addToWishlist(userId, productId) {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    // Verify product exists in catalog
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Prevent duplicates
    const existing = await wishlistRepository.findByUserAndProduct(userId, productId);
    if (existing) {
      return {
        isDuplicate: true,
        item: {
          ...existing,
          product: {
            ...existing.product,
            price: Number(existing.product.price),
            comparePrice: existing.product.comparePrice ? Number(existing.product.comparePrice) : null,
          },
        },
      };
    }

    const created = await wishlistRepository.create(userId, productId);
    return {
      isDuplicate: false,
      item: {
        ...created,
        product: {
          ...created.product,
          price: Number(created.product.price),
          comparePrice: created.product.comparePrice ? Number(created.product.comparePrice) : null,
        },
      },
    };
  }

  async getUserWishlist(userId) {
    const items = await wishlistRepository.findUserWishlist(userId);
    return items.map((item) => ({
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      createdAt: item.createdAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        description: item.product.description,
        price: Number(item.product.price),
        comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : null,
        category: item.product.category,
        images: item.product.images,
        stock: item.product.stock,
        isActive: item.product.isActive,
      },
    }));
  }

  async removeFromWishlist(userId, productId) {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    const existing = await wishlistRepository.findByUserAndProduct(userId, productId);
    if (!existing) {
      return { success: true, message: 'Item not in wishlist' };
    }

    await wishlistRepository.delete(userId, productId);
    return { success: true, message: 'Item removed from wishlist' };
  }
}

export default new WishlistService();
