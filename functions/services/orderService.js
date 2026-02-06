const admin = require("firebase-admin");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

// Ensure Firebase Admin is initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = require("../keys/serviceAccountKey.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized in orderService");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin in orderService:", error.message);
    // Continue without initialization - it might be initialized elsewhere
  }
}

// Debug Firebase Admin initialization
console.log("Firebase Admin initialized:", !!admin);
console.log("Firebase Admin version:", admin.SDK_VERSION);
console.log("Firestore available:", !!admin.firestore);
console.log("FieldValue available:", !!admin.firestore.FieldValue);

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

console.log("FieldValue imported:", !!FieldValue);
console.log("FieldValue.serverTimestamp available:", !!(FieldValue && FieldValue.serverTimestamp));

// Test database connection
const testDatabaseConnection = async () => {
  try {
    // Try to access a collection to test the connection
    const testRef = db.collection('_test_connection');
    await testRef.limit(1).get();
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Test the connection when the module loads
testDatabaseConnection().then(isConnected => {
  if (!isConnected) {
    console.warn("⚠️ Database connection test failed - some operations may not work");
  }
});

const COLLECTION_NAME = "orders";
const COUNTER_COLLECTION = "counters";

// Helper function to get server timestamp or fallback to current date
const getServerTimestamp = () => {
  try {
    // First try: use FieldValue.serverTimestamp if available
    if (FieldValue && FieldValue.serverTimestamp) {
      console.log("Using FieldValue.serverTimestamp()");
      return FieldValue.serverTimestamp();
    }
    
    // Second try: use admin.firestore.FieldValue.serverTimestamp directly
    if (admin.firestore && admin.firestore.FieldValue && admin.firestore.FieldValue.serverTimestamp) {
      console.log("Using admin.firestore.FieldValue.serverTimestamp()");
      return admin.firestore.FieldValue.serverTimestamp();
    }
    
    // Third try: use a different approach with admin.firestore
    if (admin.firestore) {
      try {
        const directFieldValue = admin.firestore.FieldValue;
        if (directFieldValue && directFieldValue.serverTimestamp) {
          console.log("Using direct admin.firestore.FieldValue.serverTimestamp()");
          return directFieldValue.serverTimestamp();
        }
      } catch (directError) {
        console.warn("Direct FieldValue access failed:", directError.message);
      }
    }
    
    // Fallback: use current date
    console.log("All FieldValue methods failed, using current date");
    return new Date();
    
  } catch (error) {
    console.warn("Error in getServerTimestamp, using current date:", error.message);
    return new Date();
  }
};

// Alternative timestamp function for when FieldValue is completely unavailable
const getAlternativeTimestamp = () => {
  try {
    // Try to create a Firestore-compatible timestamp
    if (admin.firestore && admin.firestore.Timestamp) {
      return admin.firestore.Timestamp.now();
    }
    
    // Fallback to regular Date
    return new Date();
  } catch (error) {
    console.warn("Error in getAlternativeTimestamp, using current date:", error.message);
    return new Date();
  }
};

// Function to generate auto-incrementing order number
const generateOrderNumber = async () => {
  try {
    // Get current date in Sri Lankan timezone
    const now = dayjs().tz("Asia/Colombo");
    const yearMonth = now.format("YYYYMM");
    
    console.log(`Generating order number for month: ${yearMonth}`);
    
    // Reference to the counter document for this month
    const counterRef = db.collection(COUNTER_COLLECTION).doc(yearMonth);
    
    // Use a transaction to safely increment the counter
    const result = await db.runTransaction(async (transaction) => {
      try {
        const counterDoc = await transaction.get(counterRef);
        
        let currentCount = 1;
        if (counterDoc.exists) {
          const counterData = counterDoc.data();
          if (counterData && counterData.count) {
            currentCount = counterData.count + 1;
            console.log(`Existing counter found: ${counterData.count}, incrementing to: ${currentCount}`);
          } else {
            console.log(`Counter document exists but no count field, starting from: ${currentCount}`);
          }
        } else {
          console.log(`No counter document found for ${yearMonth}, creating new counter starting from: ${currentCount}`);
        }
        
        // Update the counter
        transaction.set(counterRef, { 
          count: currentCount,
          lastUpdated: getServerTimestamp()
        });
        
        return currentCount;
      } catch (transactionError) {
        console.error("Transaction error in generateOrderNumber:", transactionError);
        throw transactionError;
      }
    });
    
    // Format: YYYYMM + padded order number (e.g., 20250801, 20250802)
    const orderNumber = `${yearMonth}${result.toString().padStart(2, '0')}`;
    console.log(`Successfully generated order number: ${orderNumber}`);
    return orderNumber;
  } catch (error) {
    console.error("Error generating order number:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // If it's a transaction error, try a simpler approach
    if (error.code === 'FAILED_PRECONDITION' || error.code === 'ABORTED') {
      console.log("Transaction failed, trying alternative approach...");
      return await generateOrderNumberAlternative();
    }
    
    throw new Error(`Error generating order number: ${error.message}`);
  }
};

// Alternative approach if transaction fails
const generateOrderNumberAlternative = async () => {
  try {
    const now = dayjs().tz("Asia/Colombo");
    const yearMonth = now.format("YYYYMM");
    
    console.log(`Using alternative method for month: ${yearMonth}`);
    
    const counterRef = db.collection(COUNTER_COLLECTION).doc(yearMonth);
    
    // Try to get the current counter
    const counterDoc = await counterRef.get();
    
    let currentCount = 1;
    if (counterDoc.exists) {
      const counterData = counterDoc.data();
      if (counterData && counterData.count) {
        currentCount = counterData.count + 1;
      }
    }
    
    // Update the counter (this is not atomic but should work for most cases)
          await counterRef.set({ 
        count: currentCount,
        lastUpdated: getServerTimestamp()
      });
    
    const orderNumber = `${yearMonth}${currentCount.toString().padStart(2, '0')}`;
    console.log(`Alternative method generated order number: ${orderNumber}`);
    return orderNumber;
  } catch (alternativeError) {
    console.error("Alternative method also failed:", alternativeError);
    throw new Error(`Failed to generate order number with both methods: ${alternativeError.message}`);
  }
};

// Function to initialize counter for a specific month (useful for testing or manual setup)
const initializeCounter = async (yearMonth = null) => {
  try {
    const now = dayjs().tz("Asia/Colombo");
    const targetMonth = yearMonth || now.format("YYYYMM");
    
    console.log(`Initializing counter for month: ${targetMonth}`);
    
    const counterRef = db.collection(COUNTER_COLLECTION).doc(targetMonth);
    
    // Check if counter already exists
    const existingCounter = await counterRef.get();
    if (existingCounter.exists) {
      const data = existingCounter.data();
      console.log(`Counter already exists for ${targetMonth}:`, data);
      return data;
    }
    
    // Initialize counter starting from 0
    const initialData = {
      count: 0,
      lastUpdated: getServerTimestamp(),
      initialized: true
    };
    
    await counterRef.set(initialData);
    console.log(`Successfully initialized counter for ${targetMonth}:`, initialData);
    
    return initialData;
  } catch (error) {
    console.error(`Error initializing counter for ${yearMonth}:`, error);
    throw new Error(`Failed to initialize counter: ${error.message}`);
  }
}; 

const createOrder = async (orderData) => {
  try {
    // Generate the order number first
    let orderNumber;
    try {
      orderNumber = await generateOrderNumber();
    } catch (orderNumberError) {
      console.error("Failed to generate order number, using fallback:", orderNumberError);
      
      // Fallback: create a simple timestamp-based order number
      const now = dayjs().tz("Asia/Colombo");
      const timestamp = now.valueOf();
      orderNumber = `FALLBACK${timestamp}`;
      console.log(`Using fallback order number: ${orderNumber}`);
    }
    
    const orderRef = db.collection(COLLECTION_NAME).doc();
    const orderWithNumber = { 
      ...orderData, 
      orderNumber,
      status: "pending",
      createdAt: getServerTimestamp()
    };
    
    await orderRef.set(orderWithNumber);
    console.log(`Order created successfully with order number: ${orderNumber}`);
    return { id: orderRef.id, ...orderWithNumber };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Error creating order");
  }
};

const getAllOrders = async (options = {}) => {
  try {
    const { limit = 100 } = options;
    let query = db.collection(COLLECTION_NAME).orderBy("createdAt", "desc");
    if (limit > 0) {
      query = query.limit(limit);
    }
    const snapshot = await query.get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Error fetching orders");
  }
};

const updateOrder = async (orderId, updateData) => {
  try {
    const orderRef = db.collection(COLLECTION_NAME).doc(orderId);
    await orderRef.update(updateData);
    return { id: orderId, ...updateData };
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Error updating order");
  }
};

const getTodayOrders = async () => {
  try {
    // Get current time in Sri Lankan timezone
    const now = dayjs().tz("Asia/Colombo");

    // Get start and end of day in Sri Lankan timezone
    const startOfDay = now.startOf("day");
    const endOfDay = now.endOf("day");

    // Convert to UTC for Firestore query
    const startOfDayUTC = startOfDay.utc().toDate();
    const endOfDayUTC = endOfDay.utc().toDate();

    console.log("Sri Lankan time:", now.format("YYYY-MM-DD HH:mm:ss"));
    console.log("Start of day (SL):", startOfDay.format("YYYY-MM-DD HH:mm:ss"));
    console.log("End of day (SL):", endOfDay.format("YYYY-MM-DD HH:mm:ss"));
    console.log("Start of day (UTC):", startOfDayUTC);
    console.log("End of day (UTC):", endOfDayUTC);

    // Try the timezone-aware query first
    let snapshot = await db
      .collection(COLLECTION_NAME)
      .where("date", ">=", startOfDayUTC)
      .where("date", "<=", endOfDayUTC)
      .orderBy("date", "desc")
      .get();

    console.log("Timezone query results count:", snapshot.docs.length);

    // If no results, try a broader approach - get orders from the last 24 hours
    if (snapshot.docs.length === 0) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      console.log("Trying 24-hour fallback from:", twentyFourHoursAgo);

      snapshot = await db
        .collection(COLLECTION_NAME)
        .where("date", ">=", twentyFourHoursAgo)
        .orderBy("date", "desc")
        .get();

      console.log("24-hour fallback results count:", snapshot.docs.length);
    }

    // If still no results, try a simple date string comparison
    if (snapshot.docs.length === 0) {
      const todayString = now.format("YYYY-MM-DD");
      console.log("Trying date string comparison for:", todayString);

      // Get all orders and filter by date string
      const allSnapshot = await db.collection(COLLECTION_NAME).get();
      const filteredDocs = allSnapshot.docs.filter((doc) => {
        const orderDate = doc.data().date;
        if (orderDate) {
          const orderDateString = new Date(orderDate)
            .toISOString()
            .split("T")[0];
          return orderDateString === todayString;
        }
        return false;
      });

      console.log("Date string filter results count:", filteredDocs.length);
      snapshot = { docs: filteredDocs };
    }

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    throw new Error("Error fetching today's orders");
  }
};

// Function to handle product returns
const createReturnDocument = async (returnData) => {
  try {
    const { orderId, dateSent, dateReturn, reason, deliverCharge, productCost } = returnData;
    
    // Validate required fields
    if (!orderId || !dateReturn || !reason) {
      throw new Error("orderId, dateReturn, and reason are required fields");
    }
    
    // Create return document structure
    const returnDocument = {
      orderId: orderId,
      dateSent: dateSent || null,
      dateReturn: dateReturn,
      reason: reason,
      deliverCharge: deliverCharge || "0",
      productCost: productCost || "5000",
      status: "returned",
      createdAt: getServerTimestamp(),
      updatedAt: getServerTimestamp()
    };
    
    // Store in returns collection
    const returnRef = db.collection("returns").doc();
    await returnRef.set(returnDocument);
    
    // Update the original order status to "returned"
    const orderRef = db.collection(COLLECTION_NAME).doc(orderId);
    await orderRef.update({
      status: "returned",
      returnId: returnRef.id,
      updatedAt: getServerTimestamp()
    });
    
    console.log(`Return document created successfully for order: ${orderId}`);
    return { id: returnRef.id, ...returnDocument };
  } catch (error) {
    console.error("Error creating return document:", error);
    throw new Error(`Error creating return document: ${error.message}`);
  }
};

// Function to get all returns
const getAllReturns = async () => {
  try {
    const snapshot = await db.collection("returns").orderBy("createdAt", "desc").get();
    const returns = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return returns;
  } catch (error) {
    console.error("Error fetching returns:", error);
    throw new Error("Error fetching returns");
  }
};

// Function to get returns by order ID
const getReturnsByOrderId = async (orderId) => {
  try {
    const snapshot = await db.collection("returns").where("orderId", "==", orderId).get();
    const returns = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return returns;
  } catch (error) {
    console.error("Error fetching returns by order ID:", error);
    throw new Error("Error fetching returns by order ID");
  }
};

// Function to update return document
const updateReturn = async (returnId, updateData) => {
  try {
    const returnRef = db.collection("returns").doc(returnId);
    const updatePayload = {
      ...updateData,
      updatedAt: getServerTimestamp()
    };
    
    await returnRef.update(updatePayload);
    return { id: returnId, ...updatePayload };
  } catch (error) {
    console.error("Error updating return:", error);
    throw new Error("Error updating return");
  }
};

module.exports = { 
  createOrder, 
  getAllOrders, 
  updateOrder, 
  getTodayOrders,
  initializeCounter,
  generateOrderNumber,
  createReturnDocument,
  getAllReturns,
  getReturnsByOrderId,
  updateReturn
};
