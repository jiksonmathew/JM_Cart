const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");

exports.createOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxPrice = 0,
    shippingPrice = 0,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorHandler("No order items found", 400));
  }

  const updatedOrderItems = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.product);

      if (!product) {
        throw new ErrorHandler("Product not found", 404);
      }

      const basePrice = Number(product.originalPrice) || 0;

      // ✅ FIXED OFFER LOGIC
      const offer =
        Number(product.offer?.percentage) ||
        Number(product.offerPercentage) ||
        Number(product.fallbackOfferPercentage) ||
        0;

      const finalPrice =
        offer > 0
          ? Math.round(basePrice - (basePrice * offer) / 100)
          : basePrice;

      return {
        product: item.product,
        name: product.name,
        price: finalPrice,
        image: product.images?.[0]?.url || "/placeholder.png",
        quantity: item.quantity,
        originalPrice: basePrice,
        offerPercentage: offer,
      };
    }),
  );

  const itemsPrice = updatedOrderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // ✅ SAFE TOTAL CALCULATION
  const totalPrice = Math.round(itemsPrice + taxPrice + shippingPrice);

  const order = await Order.create({
    shippingInfo,
    orderItems: updatedOrderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  const orderedProductIds = updatedOrderItems.map((item) => item.product);

  await Cart.deleteMany({
    user: req.user._id,
    product: { $in: orderedProductIds },
  });

  res.status(201).json({
    success: true,
    order,
  });
});

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (
    order.user &&
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new ErrorHandler("Not authorized to view this order", 403));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getMyOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

const updateStock = async (productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ErrorHandler("Product not found", 404);
  }

  if (product.stock < quantity) {
    throw new ErrorHandler("Not enough stock available", 400);
  }

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
};

exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("This order has already been delivered", 400));
  }

  if (!req.body.status) {
    return next(new ErrorHandler("Order status is required", 400));
  }

  if (req.body.status === "Shipped" && order.orderStatus !== "Shipped") {
    await Promise.all(
      order.orderItems.map((item) => updateStock(item.product, item.quantity)),
    );
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Order status updated to ${req.body.status}`,
  });
});

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
