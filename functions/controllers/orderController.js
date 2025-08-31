const { createOrder: createOrderService, getAllOrders: getAllOrdersService, updateOrder: updateOrderService, getTodayOrders: getTodayOrdersService } = require("../services/orderService");

const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const result = await createOrderService(orderData);
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in createOrder controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create order"
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersService();
    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error("Error in getAllOrders controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve orders"
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;
    
    const result = await updateOrderService(orderId, updateData);
    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in updateOrder controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update order"
    });
  }
};

const getTodayOrders = async (req, res) => {
  try {
    const orders = await getTodayOrdersService();
    return res.status(200).json({
      success: true,
      message: "Today's orders retrieved successfully",
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error("Error in getTodayOrders controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve today's orders"
    });
  }
};

module.exports = { createOrder, getAllOrders, updateOrder, getTodayOrders };