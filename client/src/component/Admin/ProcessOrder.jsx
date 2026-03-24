import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { Typography, Button } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

import "./processOrder.css";

import {
  getSingleOrder,
  updateOrder,
  resetOrderFlags,
  clearErrors,
} from "../../features/order/orderSlice";

import { useSelector, useDispatch } from "react-redux";

import Loader from "../layout/Loader/Loader";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";

const ProcessOrder = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { order, error, loading, isUpdated } = useSelector(
    (state) => state.order,
  );

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Order Updated Successfully");
      dispatch(resetOrderFlags());
    }

    dispatch(getSingleOrder(id));
  }, [dispatch, id, error, isUpdated]);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();

    if (!status) {
      toast.error("Please select order status");
      return;
    }

    dispatch(updateOrder({ id, orderData: { status } }));
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="confirmOrderPageContainer">
        {loading ? (
          <Loader />
        ) : (
          <div
            className="confirmOrderPage"
            style={{
              display: order?.orderStatus === "Delivered" ? "block" : "grid",
            }}
          >
            <div>
              <div className="confirmshippingArea">
                <Typography component="p">Shipping Info</Typography>

                <div className="orderDetailsContainerBox">
                  <div>
                    <p>Name:</p>
                    <span>{order?.user?.name}</span>
                  </div>

                  <div>
                    <p>Phone:</p>
                    <span>{order?.shippingInfo?.phoneNo}</span>
                  </div>

                  <div>
                    <p>Address:</p>
                    <span>
                      {order?.shippingInfo &&
                        `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                    </span>
                  </div>
                </div>

                <Typography component="p">Payment</Typography>

                <div className="orderDetailsContainerBox">
                  <div>
                    <p
                      className={
                        order?.paymentInfo?.status === "succeeded"
                          ? "greenColor"
                          : "redColor"
                      }
                    >
                      {order?.paymentInfo?.status === "succeeded"
                        ? "PAID"
                        : "NOT PAID"}
                    </p>
                  </div>

                  <div>
                    <p>Amount:</p>
                    <span>₹{order?.totalPrice}</span>
                  </div>
                </div>

                <Typography component="p">Order Status</Typography>

                <div className="orderDetailsContainerBox">
                  <div>
                    <p
                      className={
                        order?.orderStatus === "Delivered"
                          ? "greenColor"
                          : "redColor"
                      }
                    >
                      {order?.orderStatus}
                    </p>
                  </div>
                </div>
              </div>

              <div className="confirmCartItems">
                <Typography component="p">Your Cart Items:</Typography>

                <div className="confirmCartItemsContainer">
                  {order?.orderItems?.map((item) => (
                    <div key={`${item.product}-${item.quantity}`}>
                      <img src={item.image} alt={item.name} />

                      <Link to={`/product/${item.product}`}>{item.name}</Link>

                      <span>
                        {item.quantity} × ₹{item.price} =
                        <b> ₹{item.price * item.quantity}</b>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {order?.orderStatus !== "Delivered" && (
              <div>
                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h1>Process Order</h1>

                  <div>
                    <AccountTreeIcon />

                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Choose Status</option>

                      {order?.orderStatus === "Processing" && (
                        <option value="Shipped">Shipped</option>
                      )}

                      {order?.orderStatus === "Shipped" && (
                        <option value="Delivered">Delivered</option>
                      )}
                    </select>
                  </div>

                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={loading || status === ""}
                    variant="contained"
                  >
                    Process
                  </Button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessOrder;
