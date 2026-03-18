const razorpay = require("../config/razorpay");
const crypto = require("crypto");

exports.verifyPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (expectedSign === razorpay_signature) {
    return res.status(200).json({
      success: true,
    });
  }

  return res.status(400).json({
    success: false,
    message: "Invalid signature",
  });
};
exports.processPayment = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount) * 100,
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log("RAZORPAY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
