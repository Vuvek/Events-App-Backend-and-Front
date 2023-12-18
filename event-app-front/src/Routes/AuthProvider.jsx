import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getDataFromStorage } from "../utils/commonFunctions";
import { BounceLoader } from "react-spinners";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getDataFromStorage("token");
    if (user) {
      if (
        location.pathname.startsWith("/signin") ||
        location.pathname.startsWith("/signup")
      ) {
        navigate("/");
      } else {
        navigate(location.pathname);
      }
    } else {
      if (
        location.pathname.startsWith("/signin") ||
        location.pathname.startsWith("/signup")
      ) {
        navigate(location.pathname);
      } else {
        navigate("/signin");
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-start justify-center absolute top-[45%]">
        <BounceLoader color="black" size={60} />
      </div>
    );
  }
  return <>{children}</>;
};

export default AuthProvider;
