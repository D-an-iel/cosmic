import prisma from '../db.js';
import crypto from 'crypto';

class UserRepository {
  async create(data) {
    return await prisma.user.create({
      data,
    });
  }

  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findByPhone(phone) {
    return await prisma.user.findFirst({
      where: { phone },
    });
  }

  async createUserByPhone(phone) {
    return await prisma.user.create({
      data: {
        phone,
        name: 'OTP User', // Default name for OTP users
        email: `${phone}@otp.cosmic.com`, // Placeholder email to satisfy unique constraint if required
        password: crypto.randomBytes(32).toString('hex'), // Dummy password
      },
    });
  }

  async update(id, data) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }
}

export default new UserRepository();
