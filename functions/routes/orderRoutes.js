const express = require("express");
const router = express.Router();
const { orderService } = require("../services/orderService");
const { createOrder, getAllOrders, updateOrder, getTodayOrders } = require("../controllers/orderController");
const { validateCreateOrder, validateUpdateOrder } = require("../middleware/validation");

// Create Order
router.post("/", validateCreateOrder, createOrder);

// Get All Orders
router.get("/", getAllOrders);

// Get Today's Orders
router.get("/today", getTodayOrders);

// Update Order
router.put("/:orderId", validateUpdateOrder, updateOrder);


module.exports = router;
