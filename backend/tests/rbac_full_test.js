#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:4000/api';

async function runTests() {
  try {
    const testUser = {
      name: 'RBAC Test User',
      email: `rbac_test_${Date.now()}@test.com`,
      password: 'Password123!',
      phone: '1234567890'
    };

    console.log('--- TEST 1 & 2: Customer Access ---');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const regData = await regRes.json();
    const token = regData.token;

    const adminRes1 = await fetch(`${BASE_URL}/admin/test`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Customer Access Status: ${adminRes1.status}`);
    if (adminRes1.status === 403) console.log('RESULT: SUCCESS (403 Forbidden)');
    else console.log('RESULT: FAILED');

    console.log('\n--- TEST 3 & 4: Admin Access ---');
    await prisma.user.update({
      where: { email: testUser.email },
      data: { role: 'ADMIN' },
    });
    console.log('User promoted to ADMIN.');

    // We need a new token because the role is encoded in the JWT
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const loginData = await loginRes.json();
    const adminToken = loginData.token;

    const adminRes2 = await fetch(`${BASE_URL}/admin/test`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log(`Admin Access Status: ${adminRes2.status}`);
    if (adminRes2.status === 200) console.log('RESULT: SUCCESS (200 OK)');
    else console.log('RESULT: FAILED');

    console.log('\n--- TEST 5: OTP Flow (New User = Customer) ---');
    const phone = `987654321${Math.floor(Math.random() * 100)}`;
    await fetch(`${BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });

    // Find OTP from DB to verify it
    const otpRecord = await prisma.otp.findUnique({ where: { phone } });
    const otpCode = otpRecord.code;

    const verifyRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code: otpCode })
    });
    const verifyData = await verifyRes.json();
    const otpToken = verifyData.token;

    const adminRes3 = await fetch(`${BASE_URL}/admin/test`, {
      headers: { 'Authorization': `Bearer ${otpToken}` }
    });
    console.log(`OTP User Access Status: ${adminRes3.status}`);
    if (adminRes3.status === 403) console.log('RESULT: SUCCESS (403 Forbidden)');
    else console.log('RESULT: FAILED');

  } catch (error) {
    console.error('Test Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
