import prisma from '../db.js';

class ProductRepository {
  async create(data) {
    return await prisma.product.create({
      data,
    });
  }

  async findAll() {
    return await prisma.product.findMany();
  }

  async findBySlug(slug) {
    return await prisma.product.findUnique({
      where: { slug },
    });
  }

  async findById(id) {
    return await prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id, data) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.product.delete({
      where: { id },
    });
  }
}

export default new ProductRepository();
