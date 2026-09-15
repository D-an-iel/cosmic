#!/usr/bin/env node

const BASE_URL = 'http://localhost:4000/api';

async function runAdminSuite() {
  console.log('--- STARTING LUXURY ADMIN OPERATIONS TEST SUITE ---');

  try {
    // 1. Authenticate as Atelier Director
    console.log('\n[1] Testing Admin Authentication (/api/auth/login)...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@cosmic.com', password: 'admin123' }),
    });

    const loginData = await loginRes.json();
    if (!loginData.success || loginData.user.role !== 'ADMIN') {
      throw new Error(`Admin login failed: ${JSON.stringify(loginData)}`);
    }
    const token = loginData.token;
    console.log('✅ Admin Authenticated. Role:', loginData.user.role);

    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // 2. Telemetry & Metrics
    console.log('\n[2] Testing Telemetry & KPI Metrics (/api/admin/metrics)...');
    const metricsRes = await fetch(`${BASE_URL}/admin/metrics`, { headers: authHeaders });
    const metricsData = await metricsRes.json();
    if (!metricsData.success) throw new Error('Failed to fetch metrics');
    console.log('✅ Metrics Retrieved:');
    console.log('   - Cumulative Gross Vault Revenue: ₹' + metricsData.data.grossRevenue);
    console.log('   - Total Orders in Queue:', metricsData.data.totalOrdersCount);
    console.log('   - Awaiting Dispatch:', metricsData.data.awaitingDispatchCount);
    console.log('   - AOV: ₹' + metricsData.data.aov);
    console.log('   - Fulfillment Velocity:', metricsData.data.fulfillmentVelocity);

    // 3. Orders Master Ledger
    console.log('\n[3] Testing Master Order Ledger (/api/admin/orders)...');
    const ordersRes = await fetch(`${BASE_URL}/admin/orders`, { headers: authHeaders });
    const ordersData = await ordersRes.json();
    if (!ordersData.success) throw new Error('Failed to fetch orders');
    console.log(`✅ Retrieved ${ordersData.data.orders.length} orders in ledger.`);
    const firstOrder = ordersData.data.orders[0];
    if (firstOrder) {
      console.log(`   - Sample Order #${firstOrder.orderNumber}: Patron=${firstOrder.user?.name}, Tier=${firstOrder.patronTier}, Status=${firstOrder.status}, Value=₹${firstOrder.total}`);
    }

    // 4. Single Order Dossier
    if (firstOrder) {
      console.log(`\n[4] Testing Order Dossier (/api/admin/orders/${firstOrder.id})...`);
      const dossierRes = await fetch(`${BASE_URL}/admin/orders/${firstOrder.id}`, { headers: authHeaders });
      const dossierData = await dossierRes.json();
      if (!dossierData.success) throw new Error('Failed to fetch order dossier');
      console.log('✅ Order Dossier retrieved successfully.');
      console.log('   - Patron Tier in Dossier:', dossierData.data.patronDossier?.tier);
      console.log('   - Patron LTV: ₹' + dossierData.data.patronDossier?.ltv);
    }

    // 5. Products Vault
    console.log('\n[5] Testing Fine Jewelry Vault Catalog (/api/admin/products)...');
    const productsRes = await fetch(`${BASE_URL}/admin/products`, { headers: authHeaders });
    const productsData = await productsRes.json();
    if (!productsData.success) throw new Error('Failed to fetch products');
    console.log(`✅ Retrieved ${productsData.data.length} pieces in vault.`);
    if (productsData.data[0]) {
      console.log(`   - Sample Piece: ${productsData.data[0].name} (Stock: ${productsData.data[0].stock} units, Price: ₹${productsData.data[0].price})`);
    }

    // 6. VIP Clientèle Directory
    console.log('\n[6] Testing VIP Clientèle Directory (/api/admin/customers)...');
    const customersRes = await fetch(`${BASE_URL}/admin/customers`, { headers: authHeaders });
    const customersData = await customersRes.json();
    if (!customersData.success) throw new Error('Failed to fetch customers');
    console.log(`✅ Retrieved ${customersData.data.length} patrons.`);
    const vipPatron = customersData.data.find(c => c.tier === 'MAISON OBSIDIAN VIP') || customersData.data[0];
    if (vipPatron) {
      console.log(`   - Patron Profile: ${vipPatron.name} (${vipPatron.tier}), LTV: ₹${vipPatron.ltv}, Orders: ${vipPatron.totalOrders}`);
    }

    // 7. Status Advancement Test
    if (firstOrder) {
      console.log(`\n[7] Testing Order Status Transition (/api/admin/orders/${firstOrder.id}/status)...`);
      const updateRes = await fetch(`${BASE_URL}/admin/orders/${firstOrder.id}/status`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status: 'PROCESSING' }),
      });
      const updateData = await updateRes.json();
      if (!updateData.success) throw new Error('Failed to update status');
      console.log('✅ Order status successfully updated to:', updateData.data.status);
    }

    console.log('\n=============================================');
    console.log('🎉 ALL LUXURY ADMIN TESTS PASSED PERFECTLY!');
    console.log('=============================================\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
    process.exit(1);
  }
}

runAdminSuite();
