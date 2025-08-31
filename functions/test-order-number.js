const admin = require("firebase-admin");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

// Initialize Firebase Admin (you'll need to set up your service account)
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   // or use service account key
//   // credential: admin.credential.cert(require('./keys/serviceAccountKey.json'))
// });

const db = admin.firestore();
const COUNTER_COLLECTION = "counters";

// Function to generate auto-incrementing order number (same as in orderService.js)
const generateOrderNumber = async () => {
  try {
    // Get current date in Sri Lankan timezone
    const now = dayjs().tz("Asia/Colombo");
    const yearMonth = now.format("YYYYMM");
    
    console.log(`Current date (SL): ${now.format("YYYY-MM-DD")}`);
    console.log(`Year-Month format: ${yearMonth}`);
    
    // Reference to the counter document for this month
    const counterRef = db.collection(COUNTER_COLLECTION).doc(yearMonth);
    
    // Use a transaction to safely increment the counter
    const result = await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      
      let currentCount = 1;
      if (counterDoc.exists) {
        currentCount = counterDoc.data().count + 1;
        console.log(`Existing count: ${counterDoc.data().count}`);
      } else {
        console.log("No existing counter, starting from 1");
      }
      
      // Update the counter
      transaction.set(counterRef, { 
        count: currentCount,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return currentCount;
    });
    
    // Format: YYYYMM + padded order number (e.g., 20250801, 20250802)
    const orderNumber = `${yearMonth}${result.toString().padStart(2, '0')}`;
    console.log(`Generated order number: ${orderNumber}`);
    
    return orderNumber;
  } catch (error) {
    console.error("Error generating order number:", error);
    throw new Error("Error generating order number");
  }
};

// Test function to simulate multiple order creations
const testOrderNumberGeneration = async () => {
  try {
    console.log("=== Testing Order Number Generation ===\n");
    
    // Generate multiple order numbers to test the increment
    for (let i = 0; i < 5; i++) {
      console.log(`\n--- Test ${i + 1} ---`);
      const orderNumber = await generateOrderNumber();
      console.log(`Final order number: ${orderNumber}`);
      
      // Small delay to see the progression
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log("\n=== Test Complete ===");
  } catch (error) {
    console.error("Test failed:", error);
  }
};

// Example of how the order number would be used in createOrder
const createOrderExample = async (orderData) => {
  try {
    console.log("\n=== Creating Order Example ===");
    
    // Generate the order number first
    const orderNumber = await generateOrderNumber();
    
    const orderWithNumber = { 
      ...orderData, 
      orderNumber,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    console.log("Order data with generated fields:");
    console.log(JSON.stringify(orderWithNumber, null, 2));
    
    return orderWithNumber;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Error creating order");
  }
};

// Example order data
const exampleOrderData = {
  fullName: "Test Customer",
  address: "123 Test Street, Test City",
  province: "Test Province",
  city: "Test City",
  phoneNumber01: "+94 71 123 4567",
  phoneNumber02: "",
  productName: "Test Product",
  trackingId: "TRK123456",
  total: 100.00,
  deliverService: "Standard Delivery",
  date: new Date().toISOString(),
  paymentMethod: "COD"
};

// Uncomment the lines below to run the tests when Firebase is properly configured
// testOrderNumberGeneration();
// createOrderExample(exampleOrderData);

module.exports = {
  generateOrderNumber,
  createOrderExample
};
