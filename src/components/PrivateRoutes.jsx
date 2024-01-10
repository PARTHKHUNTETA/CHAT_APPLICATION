import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext, { useAuth } from "../utils/AuthContext";
const PrivateRoutes = () => {
  const {user} = useContext(AuthContext);
  console.log(user)
  return <>{user ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default PrivateRoutes;
