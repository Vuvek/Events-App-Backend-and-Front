import { Outlet } from "react-router-dom";
import AuthProvider from "./AuthProvider";
import Navigation from "../components/Header/Navigation";
import Footer from "../components/Footer";

const AppLayout = () => {
  return (
    <>
      <AuthProvider>
        <Navigation />
        <div className="md:h-screen">
          <Outlet />
        </div>
        <Footer />
      </AuthProvider>
    </>
  );
};

export default AppLayout;
