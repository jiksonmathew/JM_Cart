import { useEffect, useRef } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Typography } from "@mui/material";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import "./orderSuccess.css";

const OrderSuccess = () => {
  const toastShown = useRef(false);

  useEffect(() => {
    if (!toastShown.current) {
      toast.success("Order placed successfully 🎉");
      toastShown.current = true;
    }
  }, []);

  return (
    <div className="orderSuccess">
      <CheckCircleIcon
        className="successIcon"
        aria-label="Order success icon"
      />

      <Typography variant="h5" className="successText">
        Your order has been placed successfully
      </Typography>

      <Link to="/orders" className="orderBtn">
        View Orders
      </Link>
    </div>
  );
};

export default OrderSuccess;
