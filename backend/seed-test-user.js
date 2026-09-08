import prisma from './src/db.js';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
      where: { email: 'test@cosmic.com' },
      update: { password: hashedPassword },
      create: {
        email: 'test@cosmic.com',
        password: hashedPassword,
        name: 'Test User',
      },
    });

    console.log('✅ Test user seeded successfully!');
    console.log('Credentials:');
    console.log('Email: test@cosmic.com');
    console.log('Password: password123');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit();
  }
}

seed();
