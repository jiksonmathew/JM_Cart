import { useEffect, useState } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import api from "../../app/api";
import "./payment.css";

import { createOrder, clearErrors } from "../../features/order/orderSlice";
import { clearCart } from "../../features/cart/cartSlice";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo") || "{}");

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.order);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const order = {
    shippingInfo,
    orderItems: cartItems.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images?.[0]?.url,
      quantity: item.quantity,
    })),
    itemsPrice: orderInfo?.itemsPrice,
    taxPrice: orderInfo?.taxPrice,
    shippingPrice: orderInfo?.shippingPrice,
    totalPrice: orderInfo?.totalPrice,
  };

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Redirect if cart empty
  useEffect(() => {
    if (!orderInfo || totalItems === 0) {
      navigate("/cart");
    }
  }, [orderInfo, totalItems, navigate]);

  const handlePayment = async () => {
    try {
      setProcessing(true);

      const { data } = await api.post("/payment/process", {
        amount: Math.round(orderInfo.totalPrice),
      });

      if (!window.Razorpay) {
        toast.error("Payment system failed to load");
        setProcessing(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        name: "JM Cart",
        description: "Order Payment",
        order_id: data.order.id,

        handler: async function (response) {
          try {
            const verifyRes = await api.post("/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            console.log("VERIFY RESPONSE:", verifyRes.data);

            if (!verifyRes.data.success) {
              toast.error("Payment verification failed");
              setProcessing(false);
              return;
            }

            const finalOrder = {
              ...order,
              paymentInfo: {
                id: response.razorpay_payment_id,
                status: "succeeded",
              },
            };

            console.log("ORDER TO CREATE:", finalOrder);

            const res = await dispatch(createOrder(finalOrder)).unwrap();

            console.log("ORDER RESPONSE:", res);

            toast.success("Payment Successful 🎉");

            dispatch(clearCart());
            sessionStorage.removeItem("orderInfo");

            navigate("/success");
          } catch (err) {
            console.log("ORDER ERROR:", err);
            toast.error("Order creation failed");
            setProcessing(false);
          }
        },

        prefill: {
          name: user?.name,
          email: user?.email,
          contact: shippingInfo?.phoneNo,
        },

        notes: {
          address: shippingInfo?.address,
        },

        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

      razor.on("payment.failed", () => {
        toast.error("Payment Failed");
        setProcessing(false);
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Payment Failed");
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  return (
    <>
      <CheckoutSteps activeStep={2} />

      <div className="paymentContainer">
        <form className="paymentForm">
          <Typography variant="h6" className="paymentTitle">
            Complete Your Payment
          </Typography>

          <button
            type="button"
            onClick={handlePayment}
            className="paymentFormBtn"
            disabled={processing}
          >
            {processing
              ? "Processing..."
              : `Pay ₹${orderInfo?.totalPrice || 0}`}
          </button>
        </form>
      </div>
    </>
  );
};

export default Payment;
