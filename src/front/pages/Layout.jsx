import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NavbarLog from "/workspaces/latam-pt-46-master-help/src/front/components/NavbarLog.jsx"

export const Layout = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/signin";
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ScrollToTop>
        {isAuthRoute ? <NavbarLog /> : <Navbar />}
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
        <Footer />
      </ScrollToTop>
    </div>
  );
};
