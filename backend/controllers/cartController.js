const Cart = require("../models/cartModel");

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
      "name price stock images",
    );

    res.status(200).json({
      success: true,
      cartItems,
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
      "name price stock images",
    );

    res.status(200).json({
      success: true,
      cartItems,
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
        message: "Not authorized to delete this cart item",
      });
    }

    await Cart.findByIdAndDelete(req.params.id);

    const cartItems = await Cart.find({ user: req.user._id }).populate(
      "product",
      "name price stock images",
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
