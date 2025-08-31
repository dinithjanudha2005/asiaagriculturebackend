const express = require("express");
const router = express.Router();
const { orderService } = require("../services/orderService");
const { createOrder, getAllOrders, updateOrder, getTodayOrders, createReturn, getAllReturns, getReturnsByOrderId, updateReturn } = require("../controllers/orderController");
const { validateCreateOrder, validateUpdateOrder, validateCreateReturn, validateUpdateReturn } = require("../middleware/validation");
const authenticate = require("../middleware/authMiddleware");

// Create Order
router.post("/", validateCreateOrder, authenticate, createOrder);

// Get All Orders
router.get("/",authenticate, getAllOrders);

// Get Today's Orders
router.get("/today", authenticate, getTodayOrders);

// Update Order
router.put("/:orderId", validateUpdateOrder, authenticate, updateOrder);

// Return Routes
router.post("/returns", validateCreateReturn, authenticate, createReturn);
router.get("/returns", authenticate, getAllReturns);
router.get("/returns/order/:orderId", authenticate, getReturnsByOrderId);
router.put("/returns/:returnId", validateUpdateReturn, authenticate, updateReturn);

module.exports = router;
