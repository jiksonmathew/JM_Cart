import React, { Fragment, useEffect } from "react";
import "./Cart.css";

import CartItemCard from "./CartItemCard";

import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeCartItem,
  getUserCart,
} from "../../features/cart/cartSlice";

import Typography from "@mui/material/Typography";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems = [] } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserCart());
    }
  }, [dispatch, isAuthenticated]);

  const getPrice = (product) => {
    return product?.finalPrice || product?.price || 0;
  };

  const increaseQuantity = async (productId, quantity, stock) => {
    if (!isAuthenticated) {
      toast.error("Please login to modify cart");
      return navigate("/login?redirect=cart");
    }

    const newQty = quantity + 1;

    if (newQty > stock) {
      toast.error("Stock limit reached");
      return;
    }

    await dispatch(addToCart({ productId, quantity: newQty }));
    dispatch(getUserCart());
  };

  const decreaseQuantity = async (productId, quantity) => {
    if (!isAuthenticated) {
      toast.error("Please login to modify cart");
      return navigate("/login?redirect=cart");
    }

    const newQty = quantity - 1;

    if (newQty < 1) return;

    await dispatch(addToCart({ productId, quantity: newQty }));
    dispatch(getUserCart());
  };

  const deleteCartItems = async (cartId) => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      return navigate("/login?redirect=cart");
    }

    try {
      await dispatch(removeCartItem(cartId)).unwrap();
      await dispatch(getUserCart());
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const checkoutHandler = () => {
    if (!isAuthenticated) {
      toast.error("Please login to checkout");
      return navigate("/login?redirect=shipping");
    }

    navigate("/shipping");
  };

  const grossTotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * getPrice(item.product),
    0,
  );
  console.log(cartItems);
  return (
    <Fragment>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />
          <Typography>No Product in Your Cart</Typography>
          <Link to="/products">View Products</Link>
        </div>
      ) : (
        <div className="cartPage">
          <div className="cartHeader">
            <p>Product</p>
            <p>Quantity</p>
            <p>Subtotal</p>
          </div>

          {cartItems.map((item) => (
            <div className="cartContainer" key={item._id}>
              <CartItemCard item={item} deleteCartItems={deleteCartItems} />

              <div className="cartInput">
                <button
                  onClick={() =>
                    decreaseQuantity(item.product?._id, item.quantity)
                  }
                >
                  -
                </button>

                <input type="number" value={item.quantity} readOnly />

                <button
                  onClick={() =>
                    increaseQuantity(
                      item.product?._id,
                      item.quantity,
                      item.product?.stock,
                    )
                  }
                >
                  +
                </button>
              </div>

              <p className="cartSubtotal">
                ₹{getPrice(item.product) * item.quantity}
              </p>
            </div>
          ))}

          <div className="cartGrossProfit">
            <div></div>

            <div className="cartGrossProfitBox">
              <p>Gross Total</p>
              <p>₹{grossTotal}</p>
            </div>

            <div></div>

            <div className="checkOutBtn">
              <button onClick={checkoutHandler}>Check Out</button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Cart;
