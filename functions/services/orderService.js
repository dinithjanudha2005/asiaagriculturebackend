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
    
    // Query orders created today (assuming orders have a createdAt timestamp)
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where("createdAt", ">=", startOfDayUTC)
      .where("createdAt", "<=", endOfDayUTC)
      .orderBy("createdAt", "desc")
      .get();
    
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return orders;
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    throw new Error("Error fetching today's orders");
  }
};

module.exports = { createOrder, getAllOrders, updateOrder, getTodayOrders };
