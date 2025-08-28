const admin = require("firebase-admin");

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

module.exports = { createOrder, getAllOrders, updateOrder };
