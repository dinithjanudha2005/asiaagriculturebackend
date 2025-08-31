const admin = require("firebase-admin");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const db = admin.firestore();

const COLLECTION_NAME = "orders";

const createOrder = async (orderData) => {
  try {
    const orderRef = db.collection(COLLECTION_NAME).doc();
    await orderRef.set(orderData);
    return { id: orderRef.id, ...orderData };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Error creating order");
  }
};

const getAllOrders = async () => {
  try {
    const snapshot = await db.collection(COLLECTION_NAME).get();
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
    
    console.log('Sri Lankan time:', now.format('YYYY-MM-DD HH:mm:ss'));
    console.log('Start of day (SL):', startOfDay.format('YYYY-MM-DD HH:mm:ss'));
    console.log('End of day (SL):', endOfDay.format('YYYY-MM-DD HH:mm:ss'));
    console.log('Start of day (UTC):', startOfDayUTC);
    console.log('End of day (UTC):', endOfDayUTC);
    
    // Try the timezone-aware query first
    let snapshot = await db
      .collection(COLLECTION_NAME)
      .where("date", ">=", startOfDayUTC)
      .where("date", "<=", endOfDayUTC)
      .orderBy("date", "desc")
      .get();
    
    console.log('Timezone query results count:', snapshot.docs.length);
    
    // If no results, try a broader approach - get orders from the last 24 hours
    if (snapshot.docs.length === 0) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      console.log('Trying 24-hour fallback from:', twentyFourHoursAgo);
      
      snapshot = await db
        .collection(COLLECTION_NAME)
        .where("date", ">=", twentyFourHoursAgo)
        .orderBy("date", "desc")
        .get();
      
      console.log('24-hour fallback results count:', snapshot.docs.length);
    }
    
    // If still no results, try a simple date string comparison
    if (snapshot.docs.length === 0) {
      const todayString = now.format('YYYY-MM-DD');
      console.log('Trying date string comparison for:', todayString);
      
      // Get all orders and filter by date string
      const allSnapshot = await db.collection(COLLECTION_NAME).get();
      const filteredDocs = allSnapshot.docs.filter(doc => {
        const orderDate = doc.data().date;
        if (orderDate) {
          const orderDateString = new Date(orderDate).toISOString().split('T')[0];
          return orderDateString === todayString;
        }
        return false;
      });
      
      console.log('Date string filter results count:', filteredDocs.length);
      snapshot = { docs: filteredDocs };
    }
    
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    throw new Error("Error fetching today's orders");
  }
};

module.exports = { createOrder, getAllOrders, updateOrder, getTodayOrders };
