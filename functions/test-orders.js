const axios = require('axios');

// Test data for creating orders
const testOrders = [
  {
    fullName: "John Smith",
    address: "123 Main Street, Apartment 4B, Downtown District",
    province: "Western Province",
    city: "Colombo",
    phoneNumber01: "+94 71 234 5678",
    phoneNumber02: "+94 11 234 5678",
    productName: "Organic Rice - 5kg Pack",
    trackingId: "TRK123456789",
    total: 1250.50,
    deliverService: "Express Delivery",
    date: new Date().toISOString(),
    paymentMethod: "COD"
  },
  {
    fullName: "Maria Garcia",
    address: "456 Oak Avenue, Villa 12, Residential Complex",
    province: "Central Province",
    city: "Kandy",
    phoneNumber01: "+94 81 345 6789",
    phoneNumber02: "",
    productName: "Fresh Vegetables Bundle - Mixed Seasonal",
    trackingId: "",
    total: 850.00,
    deliverService: "Standard Delivery",
    date: new Date().toISOString(),
    paymentMethod: "CASH"
  },
  {
    fullName: "Ahmed Hassan",
    address: "789 Pine Road, House 25, Suburban Area, Near City Center",
    province: "Southern Province",
    city: "Galle",
    phoneNumber01: "+94 91 456 7890",
    phoneNumber02: "+94 41 456 7890",
    productName: "Premium Tea Collection - Assorted Flavors (10 Packets)",
    trackingId: "TRK987654321",
    total: 2500.75,
    deliverService: "Premium Delivery",
    date: new Date().toISOString(),
    paymentMethod: "ANOTHER"
  }
];

// Configuration
const BASE_URL = 'http://127.0.0.1:5001/asiya-agriculture-pos-system/us-central1/api';
const ORDERS_ENDPOINT = `${BASE_URL}/orders`;

// Test functions
async function createOrder(orderData) {
  try {
    console.log(`\n🔄 Creating order for: ${orderData.fullName}`);
    const response = await axios.post(ORDERS_ENDPOINT, orderData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Order created successfully!`);
    console.log(`📋 Order ID: ${response.data.data.id || 'N/A'}`);
    console.log(`💰 Total: $${orderData.total}`);
    console.log(`📦 Product: ${orderData.productName}`);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to create order for ${orderData.fullName}:`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data.message}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    return null;
  }
}

async function getAllOrders() {
  try {
    console.log('\n🔄 Fetching all orders...');
    const response = await axios.get(ORDERS_ENDPOINT);
    
    console.log(`✅ Retrieved ${response.data.count} orders successfully!`);
    console.log('📋 Orders:');
    response.data.data.forEach((order, index) => {
      console.log(`   ${index + 1}. ${order.fullName} - ${order.productName} - $${order.total}`);
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch orders:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data.message}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Order API Tests...\n');
  console.log(`📍 API Endpoint: ${ORDERS_ENDPOINT}`);
  console.log('=' .repeat(50));
  
  // Test 1: Create multiple orders
  console.log('\n📝 TEST 1: Creating Orders');
  console.log('-'.repeat(30));
  
  for (const orderData of testOrders) {
    await createOrder(orderData);
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Test 2: Get all orders
  console.log('\n📋 TEST 2: Fetching All Orders');
  console.log('-'.repeat(30));
  await getAllOrders();
  
  console.log('\n🎉 All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  createOrder,
  getAllOrders,
  testOrders
};
