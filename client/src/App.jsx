import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import WebFont from "webfontloader";
import "./App.css";

import Footer from "./component/layout/Footer/Footer";
import UserOptions from "./component/layout/Header/UserOptions";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";
import LoginSignUp from "./component/User/LoginSignUp";
import Profile from "./component/User/Profile";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import Payment from "./component/Cart/Payment";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import OrderSuccess from "./component/Cart/OrderSuccess";
import About from "./component/layout/About/About";
import Contact from "./component/layout/Contact/Contact";
import NotFound from "./component/layout/Not Found/NotFound";
import Dashboard from "./component/Admin/Dashboard";
import Sidebar from "./component/Admin/Sidebar";
import UpdateProduct from "./component/Admin/UpdateProduct";
import UpdateUser from "./component/Admin/UpdateUser";
import UsersList from "./component/Admin/UsersList";
import OrderList from "./component/Admin/OrderList";
import ProductReviews from "./component/Admin/ProductReviews";
import NewProduct from "./component/Admin/NewProduct";
import ProcessOrder from "./component/Admin/ProcessOrder";
import ProductList from "./component/Admin/ProductList";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import PublicRoute from "./component/Route/PublicRoute";
import ScrollToTop from "./component/layout/Scroll Top/ScrollToTop";
import { getUserDetails } from "./features/user/userSlice";
import Navbar from "./component/layout/Navbar/Navbar";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isChecked } = useSelector(
    (state) => state.user,
  );

  const location = useLocation();
  const hideNavbarRoutes = [
    "/shipping",
    "/order/confirm",
    "/payment",
    "/process/payment",
  ];

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Poppins:300,400,500,600", "Roboto"],
      },
    });
  }, []);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  if (!isChecked) {
    return <div>Loading app...</div>;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />
      {isAuthenticated && <UserOptions user={user} />}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginSignUp />
            </PublicRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/me/update"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/password/update"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shipping"
          element={
            <ProtectedRoute>
              <Shipping />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order/confirm"
          element={
            <ProtectedRoute>
              <ConfirmOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/process/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/product"
          element={
            <ProtectedRoute isAdmin>
              <NewProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute isAdmin>
              <ProductList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/product/:id"
          element={
            <ProtectedRoute isAdmin>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute isAdmin>
              <OrderList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/order/:id"
          element={
            <ProtectedRoute isAdmin>
              <ProcessOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute isAdmin>
              <UsersList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute isAdmin>
              <UpdateUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute isAdmin>
              <ProductReviews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/sidebar"
          element={
            <ProtectedRoute isAdmin>
              <Sidebar />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
