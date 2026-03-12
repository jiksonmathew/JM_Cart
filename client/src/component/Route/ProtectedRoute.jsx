// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Loader from "../layout/Loader/Loader";

// const ProtectedRoute = ({ children, isAdmin }) => {
//   const { loading, isAuthenticated, user } = useSelector((state) => state.user);

//   if (loading) return <Loader />;

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (isAdmin && user?.role !== "admin") {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader";

const ProtectedRoute = ({ children, isAdmin }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) return <Loader />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (isAdmin && user?.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
