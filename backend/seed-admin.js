import prisma from './src/db.js';
import bcrypt from 'bcrypt';

async function seedAdmin() {
  try {
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@cosmic.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        name: 'Atelier Director',
      },
      create: {
        email: 'admin@cosmic.com',
        password: hashedPassword,
        name: 'Atelier Director',
        phone: '+91 98200 00001',
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user ready:');
    console.log('Email: admin@cosmic.com');
    console.log('Password: admin123');
    console.log('Role:', adminUser.role);

    // Also ensure test@cosmic.com has an address and some luxury orders
    const patronUser = await prisma.user.upsert({
      where: { email: 'patron@cosmic.com' },
      update: {
        name: 'Vikramaditya Sharma',
        phone: '+91 98201 99882',
      },
      create: {
        email: 'patron@cosmic.com',
        name: 'Vikramaditya Sharma',
        phone: '+91 98201 99882',
        password: hashedPassword,
      },
    });

    const existingAddress = await prisma.address.findFirst({
      where: { userId: patronUser.id },
    });

    const address = existingAddress || (await prisma.address.create({
      data: {
        userId: patronUser.id,
        fullName: 'Vikramaditya Sharma',
        addressLine1: 'Flat 42B, Tower 3, The Imperial, Tardeo',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        pincode: '400034',
        phone: '+91 98201 99882',
        isDefault: true,
      },
    }));

    // Get products
    const products = await prisma.product.findMany();
    if (products.length > 0) {
      const sampleOrders = [
        {
          orderNumber: 'ORD-9824',
          subtotal: 799,
          shipping: 0,
          total: 799,
          status: 'PROCESSING',
          paymentStatus: 'PAID',
          productId: products[0].id,
          price: 799,
        },
        {
          orderNumber: 'ORD-9823',
          subtotal: 1499,
          shipping: 0,
          total: 1499,
          status: 'PENDING',
          paymentStatus: 'PAID',
          productId: products[1] ? products[1].id : products[0].id,
          price: 1499,
        },
        {
          orderNumber: 'ORD-9820',
          subtotal: 2499,
          shipping: 0,
          total: 2499,
          status: 'SHIPPED',
          paymentStatus: 'PAID',
          productId: products[0].id,
          price: 2499,
        },
      ];

      for (const ord of sampleOrders) {
        const exists = await prisma.order.findUnique({
          where: { orderNumber: ord.orderNumber },
        });

        if (!exists) {
          const created = await prisma.order.create({
            data: {
              userId: patronUser.id,
              addressId: address.id,
              orderNumber: ord.orderNumber,
              subtotal: ord.subtotal,
              shipping: ord.shipping,
              total: ord.total,
              status: ord.status,
              paymentStatus: ord.paymentStatus,
              orderItems: {
                create: [
                  {
                    productId: ord.productId,
                    quantity: 1,
                    price: ord.price,
                  },
                ],
              },
              payment: {
                create: {
                  amount: ord.total,
                  status: ord.paymentStatus,
                  razorpayOrderId: `order_mock_${ord.orderNumber}`,
                  razorpayPaymentId: `pay_mock_${ord.orderNumber}`,
                },
              },
            },
          });
          console.log(`Created sample order: #${created.orderNumber}`);
        }
      }
    }
  } catch (error) {
    console.error('Error seeding admin data:', error);
  } finally {
    await prisma.$disconnect();
    process.exit();
  }
}

seedAdmin();
