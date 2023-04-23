import { resetUser } from "../../actions/user";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.user);
  useEffect(() => {
    if (role !== "admin") {
      dispatch(resetUser());
    }
  }, [role]);

  return token && token.trim() !== "" && role === "admin" ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
