import { useSelector } from "react-redux";

import { Navigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";

const ProtectedRoute = ({ children, isAdmin }) => {
  const { isAuthenticated, user, isChecked } = useSelector(
    (state) => state.user,
  );

  if (!isChecked) return <Loader />;
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
