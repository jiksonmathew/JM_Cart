import { useEffect } from "react";
import "./orderDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { getSingleOrder, clearErrors } from "../../features/order/orderSlice";
import { Link, useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import Loader from "../layout/Loader/Loader";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { order, error, loading } = useSelector((state) => state.order);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(getSingleOrder(id));
  }, [dispatch, error, id]);

  if (loading || !order) return <Loader />;

  return (
    <div className="orderDetailsPage">
      <div className="orderDetailsContainer">
        <Typography variant="h4" className="orderHeading">
          Order #{order._id}
        </Typography>

        <Typography className="sectionTitle">Shipping Info</Typography>

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

        <Typography className="sectionTitle">Payment</Typography>

        <div className="orderDetailsContainerBox">
          <div>
            <p
              className={
                order?.paymentInfo?.status === "succeeded"
                  ? "greenColor"
                  : "redColor"
              }
            >
              {order?.paymentInfo?.status === "succeeded" ? "PAID" : "NOT PAID"}
            </p>
          </div>

          <div>
            <p>Amount:</p>
            <span>₹{order?.totalPrice}</span>
          </div>
        </div>

        <Typography className="sectionTitle">Order Status</Typography>

        <div className="orderDetailsContainerBox">
          <div>
            <p
              className={
                order?.orderStatus === "Delivered" ? "greenColor" : "redColor"
              }
            >
              {order?.orderStatus}
            </p>
          </div>
        </div>
      </div>

      <div className="orderDetailsCartItems">
        <Typography className="sectionTitle">Order Items</Typography>

        <div className="orderDetailsCartItemsContainer">
          {order?.orderItems?.map((item) => (
            <div key={item.product} className="orderItem">
              <img src={item.image} alt={item.name} />
              <Link to={`/product/${item.product}`}>{item.name}</Link>
              <span>
                {item.quantity} × ₹{item.price} =
                <b> ₹{item.quantity * item.price}</b>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
