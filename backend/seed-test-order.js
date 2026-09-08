import prisma from './src/db.js';

async function seed() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'test@cosmic.com' },
    });

    if (!user) {
      console.error('❌ Test user not found. Please run seed-test-user.js first.');
      process.exit(1);
    }

    // 1. Create Address
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        fullName: 'Test User',
        addressLine1: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        country: 'India',
        pincode: '123456',
        isDefault: true,
      },
    });

    // 2. Create Order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        addressId: address.id,
        orderNumber: 'TEST-ORDER-001',
        subtotal: 5000.00,
        shipping: 0.00,
        total: 5000.00,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
    });

    console.log('✅ Test data seeded successfully!');
    console.log('User ID:', user.id);
    console.log('Order ID:', order.id);
    console.log('Order Number:', order.orderNumber);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit();
  }
}

seed();
