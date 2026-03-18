import { useSelector } from "react-redux";

import { Navigate } from "react-router-dom";

import Loader from "../layout/Loader/Loader";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  if (loading) return <Loader />;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
