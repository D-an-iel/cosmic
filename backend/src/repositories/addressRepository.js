import prisma from '../db.js';

class AddressRepository {
  async create(data) {
    return await prisma.address.create({
      data,
    });
  }

  async findByUserId(userId) {
    return await prisma.address.findMany({
      where: { userId },
    });
  }

  async findByIdAndUser(id, userId) {
    return await prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async update(id, data) {
    return await prisma.address.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.address.delete({
      where: { id },
    });
  }

  async setUserDefaultAddress(userId, addressId) {
    // First, unset all default addresses for the user
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Set the specific address as default
    return await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}

export default new AddressRepository();
