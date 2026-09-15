import prisma from '../db.js';

class WishlistRepository {
  async create(userId, productId) {
    return await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });
  }

  async findByUserAndProduct(userId, productId) {
    return await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      include: {
        product: true,
      },
    });
  }

  async findUserWishlist(userId) {
    return await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(userId, productId) {
    return await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }
}

export default new WishlistRepository();
