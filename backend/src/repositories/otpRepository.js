import prisma from '../db.js';

class OtpRepository {
  async saveOtp(phone, code, expiresAt) {
    return await prisma.otp.upsert({
      where: { phone },
      update: {
        code,
        expiresAt,
      },
      create: {
        phone,
        code,
        expiresAt,
      },
    });
  }

  async findOtpByPhone(phone) {
    return await prisma.otp.findUnique({
      where: { phone },
    });
  }

  async deleteOtp(phone) {
    return await prisma.otp.delete({
      where: { phone },
    });
  }
}

export default new OtpRepository();
