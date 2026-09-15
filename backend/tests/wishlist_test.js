#!/usr/bin/env node

const BASE_URL = 'http://localhost:4000/api';

async function runWishlistTests() {
  console.log('--- STARTING WISHLIST SYSTEM TESTS ---');

  try {
    // 0. Test Unauthorized Access (Expected: 401)
    console.log('\n[TEST 5] Testing Unauthorized Access to /api/wishlist (Expected: 401)...');
    const unauthRes = await fetch(`${BASE_URL}/wishlist`);
    console.log('Status:', unauthRes.status);
    if (unauthRes.status === 401) {
      console.log('✅ TEST 5 PASSED: Unauthorized access blocked with 401.');
    } else {
      throw new Error(`Expected 401 but got ${unauthRes.status}`);
    }

    // 1. Authenticate test user
    console.log('\nAuthenticating test user (patron@cosmic.com)...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'patron@cosmic.com', password: 'admin123' }),
    });
    const loginData = await loginRes.json();
    if (!loginData.success) {
      throw new Error('Login failed for patron@cosmic.com');
    }
    const token = loginData.token;
    console.log('Authenticated as:', loginData.user.name);

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // 2. Fetch a product to add to wishlist
    const productsRes = await fetch(`${BASE_URL}/products`);
    const productsData = await productsRes.json();
    const product = productsData.data[0];
    if (!product) throw new Error('No products found in catalog to test');
    console.log('Selected piece for testing:', product.name, `(${product.id})`);

    // Clean up first in case it's in wishlist
    await fetch(`${BASE_URL}/wishlist/${product.id}`, { method: 'DELETE', headers });

    // 3. TEST 1: Add product to wishlist
    console.log('\n[TEST 1] Adding product to wishlist...');
    const addRes = await fetch(`${BASE_URL}/wishlist`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ productId: product.id }),
    });
    const addData = await addRes.json();
    console.log('Status:', addRes.status, 'Message:', addData.message);
    if (addRes.status === 201 && addData.success && addData.data.productId === product.id) {
      console.log('✅ TEST 1 PASSED: Product added to wishlist successfully.');
    } else {
      throw new Error(`Failed to add product: ${JSON.stringify(addData)}`);
    }

    // 4. TEST 2: Add duplicate product (Prevent duplicate)
    console.log('\n[TEST 2] Adding DUPLICATE product to wishlist (Expected: Prevent duplicate)...');
    const dupRes = await fetch(`${BASE_URL}/wishlist`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ productId: product.id }),
    });
    const dupData = await dupRes.json();
    console.log('Status:', dupRes.status, 'Message:', dupData.message);
    if (dupRes.status === 200 && dupData.message.includes('already in your wishlist')) {
      console.log('✅ TEST 2 PASSED: Duplicate prevented cleanly without database collision.');
    } else {
      throw new Error(`Duplicate check failed: ${JSON.stringify(dupData)}`);
    }

    // 5. TEST 3: Fetch wishlist (Include product, images, price)
    console.log('\n[TEST 3] Fetching user wishlist...');
    const getRes = await fetch(`${BASE_URL}/wishlist`, { headers });
    const getData = await getRes.json();
    console.log('Status:', getRes.status, 'Count:', getData.count);
    const foundItem = getData.data.find((item) => item.productId === product.id);
    if (foundItem && foundItem.product && foundItem.product.name && foundItem.product.price) {
      console.log('✅ TEST 3 PASSED: Wishlist retrieved with full product data:');
      console.log(`   - Name: ${foundItem.product.name}`);
      console.log(`   - Price: ₹${foundItem.product.price}`);
      console.log(`   - Category: ${foundItem.product.category}`);
    } else {
      throw new Error('Fetched wishlist missing required product properties');
    }

    // 6. TEST 4: Remove wishlist item
    console.log('\n[TEST 4] Removing product from wishlist...');
    const delRes = await fetch(`${BASE_URL}/wishlist/${product.id}`, {
      method: 'DELETE',
      headers,
    });
    const delData = await delRes.json();
    console.log('Status:', delRes.status, 'Message:', delData.message);
    if (delRes.status === 200 && delData.success) {
      console.log('✅ TEST 4 PASSED: Product removed from wishlist successfully.');
    } else {
      throw new Error('Failed to delete item from wishlist');
    }

    // Verify deletion
    const verifyGet = await fetch(`${BASE_URL}/wishlist`, { headers });
    const verifyData = await verifyGet.json();
    const stillPresent = verifyData.data.some((item) => item.productId === product.id);
    if (!stillPresent) {
      console.log('✅ Deletion verified: Item is no longer in user wishlist.');
    } else {
      throw new Error('Item still found in wishlist after deletion');
    }

    console.log('\n=============================================');
    console.log('🎉 ALL 5 WISHLIST BACKEND TESTS PASSED!');
    console.log('=============================================\n');
  } catch (err) {
    console.error('❌ Wishlist Test Suite Failed:', err.message);
    process.exit(1);
  }
}

runWishlistTests();
