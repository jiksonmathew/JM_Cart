const express = require("express");
const router = express.Router();
const {
  processPayment,
  verifyPayment,
} = require("../controllers/paymentController");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/payment/process", isAuthenticated, processPayment);
router.post("/payment/verify", isAuthenticated, verifyPayment);

module.exports = router;
