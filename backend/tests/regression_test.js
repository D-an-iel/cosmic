#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:4000/api';

async function runRegressionTests() {
  try {
    const testUser = {
      name: 'Regression User',
      email: `reg_${Date.now()}@test.com`,
      password: 'Password123!',
      phone: '1112223333'
    };

    console.log('--- Regression: User Registration ---');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    if (regRes.ok) console.log('SUCCESS'); else throw new Error('Registration failed');

    const regData = await regRes.json();
    const token = regData.token;

    console.log('--- Regression: Order Creation ---');
    // Need a product and address first
    const product = await prisma.product.findFirst();
    if (!product) throw new Error('No products in DB');

    const address = await prisma.address.create({
      data: {
        userId: regData.user.id,
        fullName: 'Reg User',
        addressLine1: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'India',
        pincode: '123456',
      }
    });

    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        addressId: address.id,
        items: [{ productId: product.id, quantity: 1 }]
      })
    });
    if (orderRes.ok) console.log('SUCCESS'); else {
      const err = await orderRes.text();
      throw new Error(`Order failed: ${err}`);
    }

    console.log('\nALL REGRESSION TESTS PASSED');
  } catch (error) {
    console.error('Regression Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runRegressionTests();
