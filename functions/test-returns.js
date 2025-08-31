const { 
  createReturnDocument, 
  getAllReturns, 
  getReturnsByOrderId, 
  updateReturn 
} = require("./services/orderService");

// Test data for returns
const testReturnData = {
  orderId: "test_order_123",
  dateSent: new Date("2024-01-15T10:00:00.000Z"),
  dateReturn: new Date("2024-01-20T14:30:00.000Z"),
  reason: "Customer changed mind, product not needed anymore",
  deliverCharge: "500",
  productCost: "5000"
};

// Test creating a return document
const testCreateReturn = async () => {
  try {
    console.log("Testing createReturnDocument...");
    console.log("Input data:", testReturnData);
    
    const result = await createReturnDocument(testReturnData);
    console.log("✅ Return document created successfully:");
    console.log("Return ID:", result.id);
    console.log("Order ID:", result.orderId);
    console.log("Status:", result.status);
    console.log("Created at:", result.createdAt);
    
    return result;
  } catch (error) {
    console.error("❌ Error creating return document:", error.message);
    throw error;
  }
};

// Test getting all returns
const testGetAllReturns = async () => {
  try {
    console.log("\nTesting getAllReturns...");
    
    const returns = await getAllReturns();
    console.log("✅ All returns retrieved successfully:");
    console.log("Total returns:", returns.length);
    
    returns.forEach((returnDoc, index) => {
      console.log(`\nReturn ${index + 1}:`);
      console.log("  ID:", returnDoc.id);
      console.log("  Order ID:", returnDoc.orderId);
      console.log("  Reason:", returnDoc.reason);
      console.log("  Status:", returnDoc.status);
    });
    
    return returns;
  } catch (error) {
    console.error("❌ Error getting all returns:", error.message);
    throw error;
  }
};

// Test getting returns by order ID
const testGetReturnsByOrderId = async (orderId) => {
  try {
    console.log(`\nTesting getReturnsByOrderId for order: ${orderId}...`);
    
    const returns = await getReturnsByOrderId(orderId);
    console.log("✅ Returns by order ID retrieved successfully:");
    console.log("Total returns for this order:", returns.length);
    
    returns.forEach((returnDoc, index) => {
      console.log(`\nReturn ${index + 1}:`);
      console.log("  ID:", returnDoc.id);
      console.log("  Order ID:", returnDoc.orderId);
      console.log("  Reason:", returnDoc.reason);
      console.log("  Date Return:", returnDoc.dateReturn);
    });
    
    return returns;
  } catch (error) {
    console.error("❌ Error getting returns by order ID:", error.message);
    throw error;
  }
};

// Test updating a return document
const testUpdateReturn = async (returnId) => {
  try {
    console.log(`\nTesting updateReturn for return: ${returnId}...`);
    
    const updateData = {
      reason: "Updated reason: Customer requested refund due to quality issues",
      deliverCharge: "0",
      productCost: "4500"
    };
    
    console.log("Update data:", updateData);
    
    const result = await updateReturn(returnId, updateData);
    console.log("✅ Return document updated successfully:");
    console.log("Updated return:", result);
    
    return result;
  } catch (error) {
    console.error("❌ Error updating return document:", error.message);
    throw error;
  }
};

// Main test function
const runAllTests = async () => {
  try {
    console.log("🚀 Starting Return Functionality Tests...\n");
    
    // Test 1: Create return document
    const createdReturn = await testCreateReturn();
    
    // Test 2: Get all returns
    await testGetAllReturns();
    
    // Test 3: Get returns by order ID
    await testGetReturnsByOrderId(testReturnData.orderId);
    
    // Test 4: Update return document
    if (createdReturn && createdReturn.id) {
      await testUpdateReturn(createdReturn.id);
    }
    
    console.log("\n🎉 All tests completed successfully!");
    
  } catch (error) {
    console.error("\n💥 Test suite failed:", error.message);
    console.error("Error details:", error);
  }
};

// Export test functions for individual testing
module.exports = {
  testCreateReturn,
  testGetAllReturns,
  testGetReturnsByOrderId,
  testUpdateReturn,
  runAllTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}
