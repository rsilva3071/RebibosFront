import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("access");
      const expiration = localStorage.getItem("access_expiration");

      if (!token || !expiration) return false;
      return new Date().getTime() < Number(expiration);
    };

    if (checkToken()) {
      setIsAuth(true);
    } else {
      // limpiar tokens si expiró
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("access_expiration");
      setIsAuth(false);
    }
    setLoading(false);
  }, []);

  if (loading) return null; // o un spinner
  if (!isAuth) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
