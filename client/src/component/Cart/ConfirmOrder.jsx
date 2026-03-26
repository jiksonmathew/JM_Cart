import { useSelector } from "react-redux";

import { Typography } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

import CheckoutSteps from "./CheckoutSteps";

import toast from "react-hot-toast";

import "./ConfirmOrder.css";

const ConfirmOrder = () => {
  const navigate = useNavigate();

  const { shippingInfo, cartItems = [] } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const getPrice = (product) =>
    product?.finalPrice ?? product?.originalPrice ?? 0;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * getPrice(item.product),
    0,
  );

  const shippingCharges = subtotal > 1000 ? 0 : 40;

  const tax = Math.round(subtotal * 0.18);

  const totalPrice = Math.round(subtotal + shippingCharges + tax);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  const address = `${shippingInfo?.address || ""}, ${
    shippingInfo?.city || ""
  }, ${shippingInfo?.state || ""}, ${
    shippingInfo?.pinCode || ""
  }, ${shippingInfo?.country || ""}`;

  const proceedToPayment = () => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      return navigate("/login");
    }

    if (!shippingInfo || cartItems.length === 0) {
      toast.error("Missing shipping information or cart items");
      return navigate("/cart");
    }

    const data = {
      itemsPrice: subtotal,
      shippingPrice: shippingCharges,
      taxPrice: tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    navigate("/process/payment");
  };

  return (
    <>
      <CheckoutSteps activeStep={1} />

      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography variant="h6">Shipping Info</Typography>

            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user?.name}</span>
              </div>

              <div>
                <p>Phone:</p>
                <span>{shippingInfo?.phoneNo}</span>
              </div>

              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>

          <div className="confirmCartItems">
            <Typography variant="h6">Your Cart Items</Typography>

            <div className="confirmCartItemsContainer">
              {cartItems.map((item) => {
                const price = getPrice(item.product);

                return (
                  <div key={item._id}>
                    <img
                      src={item.product?.images?.[0]?.url || "/placeholder.png"}
                      alt={item.product?.name}
                    />

                    <Link to={`/product/${item.product?._id}`}>
                      {item.product?.name}
                    </Link>

                    <span>
                      {item.quantity} × {formatPrice(price)} =
                      <b> {formatPrice(price * item.quantity)}</b>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div className="orderSummary">
            <Typography variant="h6">Order Summary</Typography>

            <div>
              <div>
                <p>Subtotal:</p>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div>
                <p>Shipping:</p>
                <span>
                  {shippingCharges === 0
                    ? "FREE"
                    : formatPrice(shippingCharges)}
                </span>
              </div>

              <div>
                <p>GST (18%):</p>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
