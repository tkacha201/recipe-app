import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { showError } from "./Toast";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    // Save the attempted URL for redirection after login
    showError("Please login to access this page");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;
