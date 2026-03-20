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

router.post("/order/new", isAuthenticated, createOrder);
router.get("/orders/me", isAuthenticated, getMyOrders);
router.get("/order/:id", isAuthenticated, getSingleOrder);
router.get("/admin/orders", isAuthenticated, isAdmin, getAllOrders);
router
  .route("/admin/order/:id")
  .get(isAuthenticated, isAdmin, getSingleOrder)
  .put(isAuthenticated, isAdmin, updateOrder)
  .delete(isAuthenticated, isAdmin, deleteOrder);
router.post("/admin/order/new", isAuthenticated, isAdmin, createOrder);

module.exports = router;
