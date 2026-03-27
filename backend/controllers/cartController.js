const Cart = require("../models/cartModel");

const calculateFinalPrice = (product = {}) => {
  const basePrice = Number(product.originalPrice) || 0;

  // ✅ Use correct offer structure
  const offer =
    Number(product.offer?.percentage) ||
    Number(product.offerPercentage) ||
    Number(product.fallbackOfferPercentage) ||
    0;

  if (offer > 0) {
    const discounted = basePrice - (basePrice * offer) / 100;
    return Math.round(discounted);
  }

  return Math.round(basePrice);
};

exports.addToCart = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

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
      "name originalPrice offer offerPercentage fallbackOfferPercentage stock images",
    );

    const updatedCartItems = cartItems
      .map((item) => {
        if (!item.product) return null;

        const product = item.product.toObject();

        return {
          ...item.toObject(),
          product: {
            ...product,
            finalPrice: calculateFinalPrice(product),
          },
        };
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      cartItems: updatedCartItems,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const cartItems = await Cart.find({ user: req.user._id }).populate(
      "product",
      "name originalPrice offer offerPercentage fallbackOfferPercentage stock images",
    );

    const updatedCartItems = cartItems
      .map((item) => {
        if (!item.product) return null;

        const product = item.product.toObject();

        return {
          ...item.toObject(),
          product: {
            ...product,
            finalPrice: calculateFinalPrice(product),
          },
        };
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      cartItems: updatedCartItems,
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

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
      "name originalPrice offer offerPercentage fallbackOfferPercentage stock images",
    );

    const updatedCartItems = cartItems
      .map((item) => {
        if (!item.product) return null;

        const product = item.product.toObject();

        return {
          ...item.toObject(),
          product: {
            ...product,
            finalPrice: calculateFinalPrice(product),
          },
        };
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      message: "Item removed",
      cartItems: updatedCartItems,
    });
  } catch (error) {
    console.error("REMOVE CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
