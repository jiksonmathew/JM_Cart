import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import "./ConfirmOrder.css";

const ConfirmOrder = () => {
  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0,
  );

  const shippingCharges = subtotal > 1000 ? 0 : 40;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + shippingCharges + tax;

  const address = `${shippingInfo?.address || ""}, ${shippingInfo?.city || ""}, ${shippingInfo?.state || ""}, ${shippingInfo?.pinCode || ""}, ${shippingInfo?.country || ""}`;

  const proceedToPayment = () => {
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
        {/* LEFT SIDE */}
        <div>
          {/* Shipping Info */}
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

          {/* Cart Items */}
          <div className="confirmCartItems">
            <Typography variant="h6">Your Cart Items</Typography>

            <div className="confirmCartItemsContainer">
              {cartItems.map((item) => (
                <div key={item._id}>
                  <img
                    src={item.product?.images?.[0]?.url}
                    alt={item.product?.name}
                  />

                  <Link to={`/product/${item.product?._id}`}>
                    {item.product?.name}
                  </Link>

                  <span>
                    {item.quantity} × ₹{item.product?.price} =
                    <b> ₹{item.product?.price * item.quantity}</b>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div>
          <div className="orderSummary">
            <Typography variant="h6">Order Summary</Typography>

            <div>
              <div>
                <p>Subtotal:</p>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div>
                <p>Shipping:</p>
                <span>
                  {shippingCharges === 0
                    ? "FREE"
                    : `₹${shippingCharges.toFixed(2)}`}
                </span>
              </div>

              <div>
                <p>GST (18%):</p>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
