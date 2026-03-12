const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");

const {
  addToCart,
  getUserCart,
  removeCartItem,
} = require("../controllers/cartController");

router.post("/cart", isAuthenticated, addToCart);
router.get("/cart", isAuthenticated, getUserCart);
router.delete("/cart/:id", isAuthenticated, removeCartItem);

module.exports = router;
