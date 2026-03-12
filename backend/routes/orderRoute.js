const express = require("express");
const {
  createOrder,
  getSingleOrder,
  getMyOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const { isAuthenticated, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// Create order
router.post("/order/new", isAuthenticated, createOrder);

// Get logged-in user's orders
router.get("/orders/me", isAuthenticated, getMyOrders);

// Get single order (user or admin)
router.get("/order/:id", isAuthenticated, getSingleOrder);

// Admin - get all orders
router.get("/admin/orders", isAuthenticated, isAdmin, getAllOrders);

// Admin order management
router
  .route("/admin/order/:id")
  .get(isAuthenticated, isAdmin, getSingleOrder)
  .put(isAuthenticated, isAdmin, updateOrder)
  .delete(isAuthenticated, isAdmin, deleteOrder);

// OPTIONAL (added for better REST consistency)
// Admin create order manually (for COD or manual orders)
router.post("/admin/order/new", isAuthenticated, isAdmin, createOrder);

module.exports = router;
