import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NavbarLog from "/workspaces/latam-pt-46-master-help/src/front/components/NavbarLog.jsx"


export const Layout = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (token === "null" || token === "undefined") {
    localStorage.removeItem("token");
  }

  const isAuthenticated = token && token !== "null" && token !== "undefined";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ScrollToTop>
        {isAuthenticated ? (
          <NavbarLog />
        ) : (
          <Navbar />
        )}
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
        <Footer />
      </ScrollToTop>
    </div>
  );
};