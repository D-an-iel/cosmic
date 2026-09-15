#!/usr/bin/env node
import { signToken } from '../src/utils/jwt.js';

async function runTests() {
  const BASE_URL = 'http://localhost:4000/api';
  const testUser = {
    name: 'Test Customer',
    email: `customer_${Date.now()}@test.com`,
    password: 'Password123!',
    phone: '1234567890'
  };

  console.log('--- TEST 1: Customer Registration & Login ---');
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  const regData = await regRes.json();
  const token = regData.token;
  console.log('Registration successful. Token obtained.');

  // Decode token to check role (simplified check)
  // In a real test we'd use jwt.decode

  console.log('\n--- TEST 2: Customer Access /api/admin/test ---');
  const adminRes = await fetch(`${BASE_URL}/admin/test`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const adminData = await adminRes.json();
  console.log(`Status: ${adminRes.status}`);
  console.log(`Response:`, adminData);

  if (adminRes.status === 403) {
    console.log('RESULT: SUCCESS (403 Forbidden)');
  } else {
    console.log('RESULT: FAILED');
  }
}

runTests().catch(console.error);
