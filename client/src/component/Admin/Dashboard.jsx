import { useEffect } from "react";
import Sidebar from "./Sidebar";
import "./dashboard.css";
import { Typography } from "@mui/material";
import { Line, Doughnut } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import toast from "react-hot-toast";
import { FaBox, FaShoppingCart, FaUsers, FaRupeeSign } from "react-icons/fa";

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

import ChartDataLabels from "chartjs-plugin-datalabels";

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
  ChartDataLabels,
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    products = [],
    loading: pLoad,
    error: pErr,
  } = useSelector((s) => s.product);
  const {
    orders = [],
    loading: oLoad,
    error: oErr,
  } = useSelector((s) => s.order);
  const {
    users = [],
    loading: uLoad,
    error: uErr,
  } = useSelector((s) => s.user);

  const loading = pLoad || oLoad || uLoad;

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (pErr) {
      toast.error(pErr);
      dispatch(clearProductErrors());
    }
    if (oErr) {
      toast.error(oErr);
      dispatch(clearOrderErrors());
    }
    if (uErr) {
      toast.error(uErr);
      dispatch(clearUserErrors());
    }
  }, [pErr, oErr, uErr, dispatch]);

  const totalAmount = orders.reduce((a, o) => a + (o.totalPrice || 0), 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const delivered = orders.filter((o) => o.orderStatus === "Delivered").length;
  const processing = orders.filter(
    (o) => o.orderStatus === "Processing",
  ).length;
  const shipped = orders.filter((o) => o.orderStatus === "Shipped").length;

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      datalabels: {
        color: "#fff",
        formatter: (value, ctx) => {
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
          return total ? ((value / total) * 100).toFixed(0) + "%" : "0%";
        },
      },
    },
  };

  return (
    <div className="dashboardWrapper">
      <Sidebar />
      <div className="dashboardContainer">
        {loading ? (
          <div className="loaderCenter">
            <Loader />
          </div>
        ) : (
          <>
            <div className="topBar">
              <Typography variant="h4">Admin Dashboard</Typography>
            </div>

            <div className="kpiGrid">
              <div
                className="kpiCard"
                onClick={() => navigate("/admin/dashboard")}
              >
                <p>Total Earnings</p>
                <FaRupeeSign /> ₹{totalAmount}
              </div>

              <div
                className="kpiCard"
                onClick={() => navigate("/admin/products")}
              >
                <p>All Products</p>
                <FaBox /> {products.length}
              </div>

              <div
                className="kpiCard"
                onClick={() => navigate("/admin/orders")}
              >
                <p>Total Orders</p>
                <FaShoppingCart /> {orders.length}
              </div>

              <div className="kpiCard" onClick={() => navigate("/admin/users")}>
                <p>All Users</p>
                <FaUsers /> {users.length}
              </div>
            </div>

            <div className="topCharts">
              <div className="chartBox">
                <h3>Stock</h3>
                <div className="chartWrapper">
                  <Doughnut
                    data={{
                      labels: ["Out", "In"],
                      datasets: [
                        {
                          data: [outOfStock, products.length - outOfStock],
                          backgroundColor: ["#ff4d6d", "#4cc9f0"],
                          cutout: "65%",
                        },
                      ],
                    }}
                    options={doughnutOptions}
                  />
                </div>
              </div>

              <div className="chartBox">
                <h3>Orders</h3>
                <div className="chartWrapper">
                  <Doughnut
                    data={{
                      labels: ["Delivered", "Shipped", "Processing"],
                      datasets: [
                        {
                          data: [delivered, shipped, processing],
                          backgroundColor: ["#00c853", "#ff9800", "#ff1744"],
                          cutout: "65%",
                        },
                      ],
                    }}
                    options={doughnutOptions}
                  />
                </div>
              </div>
            </div>

            <div className="fullGraph">
              <h3>Revenue Growth</h3>
              <Line
                data={{
                  labels: ["Start", "Revenue"],
                  datasets: [
                    {
                      data: [0, totalAmount],
                      borderColor: "#667eea",
                      backgroundColor: "rgba(102,126,234,0.2)",
                      fill: true,
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
