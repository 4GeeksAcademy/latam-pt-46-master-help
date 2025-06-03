import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NavbarLog from "/workspaces/latam-pt-46-master-help/src/front/components/NavbarLog.jsx"

export const Layout = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuthenticated = token && token !== "null" && token !== "undefined";
  const isAuthRoute = ["/login", "/signin"].includes(location.pathname);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ScrollToTop>
        {/* Show NavbarLog only if authenticated and not on login/signin */}
        {isAuthenticated && !isAuthRoute ? <NavbarLog /> : <Navbar />}
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
        <Footer />
      </ScrollToTop>
    </div>
  );
};