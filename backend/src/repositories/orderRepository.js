import prisma from '../db.js';

class OrderRepository {
  async createOrderWithItems(orderData, itemsData) {
    return await prisma.order.create({
      data: {
        ...orderData,
        orderItems: {
          create: itemsData,
        },
      },
      include: {
        orderItems: true,
        address: true,
      },
    });
  }

  async findOrdersByUserId(userId) {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOrderByIdAndUser(id, userId) {
    return await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        orderItems: {
          include: { product: true },
        },
        address: true,
      },
    });
  }

  async updateOrderStatus(id, status) {
    return await prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async updateProductStock(productId, quantityChange) {
    return await prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          increment: quantityChange,
        },
      },
    });
  }
}

export default new OrderRepository();
