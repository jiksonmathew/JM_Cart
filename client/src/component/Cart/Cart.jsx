import React, { Fragment } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../features/cart/cartSlice";
import Typography from "@mui/material/Typography";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  const increaseQuantity = (productId, quantity, stock) => {
    if (!isAuthenticated) return navigate("/login?redirect=cart");

    const newQty = quantity + 1;
    if (newQty > stock) return;

    dispatch(addToCart({ productId, quantity: newQty }));
  };

  const decreaseQuantity = (productId, quantity) => {
    if (!isAuthenticated) return navigate("/login?redirect=cart");

    const newQty = quantity - 1;
    if (newQty < 1) return;

    dispatch(addToCart({ productId, quantity: newQty }));
  };

  const deleteCartItems = (cartId) => {
    if (!isAuthenticated) return navigate("/login?redirect=cart");

    dispatch(removeFromCart(cartId));
  };

  const checkoutHandler = () => {
    if (!isAuthenticated) return navigate("/login?redirect=shipping");

    navigate("/shipping");
  };

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
                    decreaseQuantity(item.product._id, item.quantity)
                  }
                >
                  -
                </button>

                <input type="number" value={item.quantity} readOnly />

                <button
                  onClick={() =>
                    increaseQuantity(
                      item.product._id,
                      item.quantity,
                      item.product.stock,
                    )
                  }
                >
                  +
                </button>
              </div>

              <p className="cartSubtotal">
                ₹{item.product.price * item.quantity}
              </p>
            </div>
          ))}

          <div className="cartGrossProfit">
            <div></div>

            <div className="cartGrossProfitBox">
              <p>Gross Total</p>

              <p>
                ₹
                {cartItems.reduce(
                  (acc, item) => acc + item.quantity * item.product.price,
                  0,
                )}
              </p>
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
