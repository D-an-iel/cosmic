import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function makeAdmin(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    console.log(`Successfully promoted ${email} to ADMIN.`);
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address as an argument.');
  process.exit(1);
}

makeAdmin(email);
