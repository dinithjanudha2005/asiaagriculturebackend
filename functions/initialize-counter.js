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

// Simple function to initialize counter for current month
const initializeCurrentMonthCounter = async () => {
  try {
    const now = dayjs().tz("Asia/Colombo");
    const currentMonth = now.format("YYYYMM");
    
    console.log(`Initializing counter for current month: ${currentMonth}`);
    console.log(`Current date (SL): ${now.format("YYYY-MM-DD")}`);
    
    const counterRef = db.collection(COUNTER_COLLECTION).doc(currentMonth);
    
    // Check if counter already exists
    const existingCounter = await counterRef.get();
    if (existingCounter.exists) {
      const data = existingCounter.data();
      console.log(`✅ Counter already exists for ${currentMonth}:`, data);
      return data;
    }
    
    // Initialize counter starting from 0
    const initialData = {
      count: 0,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      initialized: true,
      month: currentMonth
    };
    
    await counterRef.set(initialData);
    console.log(`✅ Successfully initialized counter for ${currentMonth}:`, initialData);
    
    return initialData;
  } catch (error) {
    console.error(`❌ Error initializing counter:`, error);
    throw error;
  }
};

// Function to initialize counter for a specific month
const initializeSpecificMonthCounter = async (yearMonth) => {
  try {
    console.log(`Initializing counter for specific month: ${yearMonth}`);
    
    const counterRef = db.collection(COUNTER_COLLECTION).doc(yearMonth);
    
    // Check if counter already exists
    const existingCounter = await counterRef.get();
    if (existingCounter.exists) {
      const data = existingCounter.data();
      console.log(`✅ Counter already exists for ${yearMonth}:`, data);
      return data;
    }
    
    // Initialize counter starting from 0
    const initialData = {
      count: 0,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      initialized: true,
      month: yearMonth
    };
    
    await counterRef.set(initialData);
    console.log(`✅ Successfully initialized counter for ${yearMonth}:`, initialData);
    
    return initialData;
  } catch (error) {
    console.error(`❌ Error initializing counter for ${yearMonth}:`, error);
    throw error;
  }
};

// Function to list all existing counters
const listAllCounters = async () => {
  try {
    console.log("📋 Listing all existing counters...");
    
    const snapshot = await db.collection(COUNTER_COLLECTION).get();
    
    if (snapshot.empty) {
      console.log("No counters found in the collection.");
      return [];
    }
    
    const counters = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      counters.push({
        month: doc.id,
        ...data
      });
    });
    
    console.log(`Found ${counters.length} counter(s):`);
    counters.forEach(counter => {
      console.log(`  ${counter.month}: count=${counter.count}, lastUpdated=${counter.lastUpdated}`);
    });
    
    return counters;
  } catch (error) {
    console.error("❌ Error listing counters:", error);
    throw error;
  }
};

// Main execution function
const main = async () => {
  try {
    console.log("🚀 Starting counter initialization...\n");
    
    // Initialize current month counter
    await initializeCurrentMonthCounter();
    
    console.log("\n");
    
    // List all existing counters
    await listAllCounters();
    
    console.log("\n✅ Counter initialization completed successfully!");
    
  } catch (error) {
    console.error("\n❌ Counter initialization failed:", error);
    process.exit(1);
  }
};

// Export functions for use in other modules
module.exports = {
  initializeCurrentMonthCounter,
  initializeSpecificMonthCounter,
  listAllCounters
};

// Run if this file is executed directly
if (require.main === module) {
  main();
}
