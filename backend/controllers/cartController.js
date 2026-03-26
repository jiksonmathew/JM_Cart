const Cart = require("../models/cartModel");

const calculateFinalPrice = (product) => {
  const basePrice = product.originalPrice || 0;

  if (product.fallbackOfferPercentage > 0) {
    const discounted =
      basePrice - (basePrice * product.fallbackOfferPercentage) / 100;

    return Math.round(discounted);
  }

  return Math.round(basePrice);
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const qty = Number(quantity) || 1;

    let cartItem = await Cart.findOne({
      user: req.user._id,
      product: productId,
    });

    if (cartItem) {
      cartItem.quantity = qty;
      await cartItem.save();
    } else {
      await Cart.create({
        user: req.user._id,
        product: productId,
        quantity: qty,
      });
    }

    const cartItems = await Cart.find({ user: req.user._id }).populate(
      "product",
      "name originalPrice fallbackOfferPercentage stock images",
    );

    const updatedCartItems = cartItems.map((item) => {
      const product = item.product.toObject();

      return {
        ...item.toObject(),
        product: {
          ...product,
          finalPrice: calculateFinalPrice(product),
        },
      };
    });

    res.status(200).json({
      success: true,
      cartItems: updatedCartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user._id }).populate(
      "product",
      "name originalPrice fallbackOfferPercentage stock images",
    );

    const updatedCartItems = cartItems.map((item) => {
      const product = item.product.toObject();

      return {
        ...item.toObject(),
        product: {
          ...product,
          finalPrice: calculateFinalPrice(product),
        },
      };
    });

    res.status(200).json({
      success: true,
      cartItems: updatedCartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (cartItem.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await Cart.findByIdAndDelete(req.params.id);

    const cartItems = await Cart.find({ user: req.user._id }).populate(
      "product",
      "name originalPrice fallbackOfferPercentage stock images",
    );

    const updatedCartItems = cartItems.map((item) => {
      const product = item.product.toObject();

      return {
        ...item.toObject(),
        product: {
          ...product,
          finalPrice: calculateFinalPrice(product),
        },
      };
    });

    res.status(200).json({
      success: true,
      message: "Item removed",
      cartItems: updatedCartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
