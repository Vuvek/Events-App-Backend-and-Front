import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getDataFromStorage } from "../utils/commonFunctions";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getDataFromStorage("token");
    if (user) {
      setLoading(false);
      if (
        location.pathname.startsWith("/signin") ||
        location.pathname.startsWith("/signup")
      ) {
        navigate("/");
      } else {
        navigate(location.pathname);
      }
    } else {
      setLoading(false);
      if (
        location.pathname.startsWith("/signin") ||
        location.pathname.startsWith("/signup")
      ) {
        navigate(location.pathname);
      } else {
        navigate("/signin");
      }
    }
  }, []);

  if (loading) {
    return <div className="spinner absolute top-[50%] left-[50%]"></div>;
  }
  return <>{children}</>;
};

export default AuthProvider;
