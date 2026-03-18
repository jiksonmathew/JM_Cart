import { useEffect } from "react";
import Sidebar from "./Sidebar";
import "./dashboard.css";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import toast from "react-hot-toast";

import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  getAdminProducts,
  clearErrors as clearProductErrors,
} from "../../features/product/productSlice";

import {
  getAllOrders,
  clearErrors as clearOrderErrors,
} from "../../features/order/orderSlice";

import {
  getAllUsers,
  clearErrors as clearUserErrors,
} from "../../features/user/userSlice";

ChartJS.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    products = [],
    loading: productLoading,
    error: productError,
  } = useSelector((state) => state.product);

  const {
    orders = [],
    loading: orderLoading,
    error: orderError,
  } = useSelector((state) => state.order);

  const {
    users = [],
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (productError) {
      toast.error(productError);
      dispatch(clearProductErrors());
    }

    if (orderError) {
      toast.error(orderError);
      dispatch(clearOrderErrors());
    }

    if (userError) {
      toast.error(userError);
      dispatch(clearUserErrors());
    }
  }, [productError, orderError, userError, dispatch]);

  if (productLoading || orderLoading || userLoading) return <Loader />;

  const outOfStock = products.filter((item) => item.stock === 0).length;

  const totalAmount = orders.reduce(
    (acc, item) => acc + (item.totalPrice || 0),
    0,
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: "tomato",
        hoverBackgroundColor: "rgb(197,72,49)",
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "In Stock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboardContainer">
        <Typography variant="h4">Dashboard</Typography>

        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> {formatPrice(totalAmount)}
            </p>
          </div>

          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Products</p>
              <p>{products.length}</p>
            </Link>

            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders.length}</p>
            </Link>

            <Link to="/admin/users">
              <p>Users</p>
              <p>{users.length}</p>
            </Link>
          </div>
        </div>

        <div className="lineChart">
          <Line data={lineState} />
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
