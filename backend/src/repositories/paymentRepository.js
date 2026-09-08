import prisma from '../db.js';

class PaymentRepository {
  async createPayment(data) {
    return await prisma.payment.create({
      data,
    });
  }

  async updatePayment(orderId, updateData) {
    return await prisma.payment.update({
      where: { orderId },
      data: updateData,
    });
  }

  async findByOrderId(orderId) {
    return await prisma.payment.findUnique({
      where: { orderId },
    });
  }
}

export default new PaymentRepository();
