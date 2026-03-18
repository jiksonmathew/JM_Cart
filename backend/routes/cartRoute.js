const express = require("express");
const {
  addToCart,
  getUserCart,
  removeCartItem,
} = require("../controllers/cartController");

const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/cart", isAuthenticated, addToCart);
router.get("/cart", isAuthenticated, getUserCart);
router.delete("/cart/:id", isAuthenticated, removeCartItem);

module.exports = router;
