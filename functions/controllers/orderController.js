const { createOrder: createOrderService, getAllOrders: getAllOrdersService, updateOrder: updateOrderService, getTodayOrders: getTodayOrdersService, createReturnDocument: createReturnDocumentService, getAllReturns: getAllReturnsService, getReturnsByOrderId: getReturnsByOrderIdService, updateReturn: updateReturnService } = require("../services/orderService");

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
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 500);
    const orders = await getAllOrdersService({ limit });
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

// Create return document
const createReturn = async (req, res) => {
  try {
    const returnData = req.body;
    const result = await createReturnDocumentService(returnData);
    return res.status(201).json({
      success: true,
      message: "Return document created successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in createReturn controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create return document"
    });
  }
};

// Get all returns
const getAllReturns = async (req, res) => {
  try {
    const returns = await getAllReturnsService();
    return res.status(200).json({
      success: true,
      message: "Returns retrieved successfully",
      data: returns,
      count: returns.length
    });
  } catch (error) {
    console.error("Error in getAllReturns controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve returns"
    });
  }
};

// Get returns by order ID
const getReturnsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const returns = await getReturnsByOrderIdService(orderId);
    return res.status(200).json({
      success: true,
      message: "Returns retrieved successfully",
      data: returns,
      count: returns.length
    });
  } catch (error) {
    console.error("Error in getReturnsByOrderId controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve returns"
    });
  }
};

// Update return document
const updateReturn = async (req, res) => {
  try {
    const { returnId } = req.params;
    const updateData = req.body;
    
    const result = await updateReturnService(returnId, updateData);
    return res.status(200).json({
      success: true,
      message: "Return updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in updateReturn controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update return"
    });
  }
};

module.exports = { 
  createOrder, 
  getAllOrders, 
  updateOrder, 
  getTodayOrders,
  createReturn,
  getAllReturns,
  getReturnsByOrderId,
  updateReturn
};