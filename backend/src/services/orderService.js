import orderRepository from '../repositories/orderRepository.js';
import productRepository from '../repositories/productRepository.js';
import addressRepository from '../repositories/addressRepository.js';
import prisma from '../db.js';

class OrderService {
  generateOrderNumber() {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  async createOrder(userId, orderData) {
    const { addressId, items } = orderData;

    // 1. Validate Address Ownership
    const address = await addressRepository.findByIdAndUser(addressId, userId);
    if (!address) {
      throw new Error('Address not found or unauthorized');
    }

    // 2. Validate Products and Calculate Totals
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      if (!product.isActive) {
        throw new Error(`Product ${product.name} is currently unavailable`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const shipping = subtotal > 0 ? 10.00 : 0;
    const total = subtotal + shipping;

    // 3. Prisma Transaction: Create Order, OrderItems, and Decrement Stock
    return await prisma.$transaction(async (tx) => {
      // We use a custom implementation of the repository logic inside tx if needed,
      // but for simple create, we can call the repository if it supports tx,
      // or just use prisma directly here for the transaction.

      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          orderNumber: this.generateOrderNumber(),
          subtotal,
          shipping,
          total,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          orderItems: true,
          address: true,
        },
      });

      // Decrement stock for each product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });
  }

  async getUserOrders(userId) {
    return await orderRepository.findOrdersByUserId(userId);
  }

  async getOrderById(orderId, userId) {
    const order = await orderRepository.findOrderByIdAndUser(orderId, userId);
    if (!order) {
      throw new Error('Order not found or unauthorized');
    }
    return order;
  }

  async cancelOrder(orderId, userId) {
    const order = await orderRepository.findOrderByIdAndUser(orderId, userId);
    if (!order) {
      throw new Error('Order not found or unauthorized');
    }

    if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
      throw new Error('Only PENDING or PROCESSING orders can be cancelled');
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Restore stock
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      // 2. Update order status
      return await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });
    });
  }
}

export default new OrderService();
