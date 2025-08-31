const express = require("express");
const router = express.Router();
const { orderService } = require("../services/orderService");
const { createOrder, getAllOrders, updateOrder, getTodayOrders } = require("../controllers/orderController");
const { validateCreateOrder, validateUpdateOrder } = require("../middleware/validation");
const authenticate = require("../middleware/authMiddleware");

// Create Order
router.post("/", validateCreateOrder, authenticate, createOrder);

// Get All Orders
router.get("/",authenticate, getAllOrders);

// Get Today's Orders
router.get("/today", authenticate, getTodayOrders);

// Update Order
router.put("/:orderId", validateUpdateOrder, authenticate, updateOrder);


module.exports = router;
