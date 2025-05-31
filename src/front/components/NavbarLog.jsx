import React, { useState } from "react";
import logo from "../assets/img/master-help-logo-hz.webp";
import { Link, useNavigate } from "react-router-dom";
import "/workspaces/latam-pt-46-master-help/src/front/index.css";

const Navbar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
      <div className="container-fluid px-3 px-md-5 d-flex flex-wrap justify-content-between align-items-center">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="Master Help Logo" height="40" />
        </a>

        <div className="d-flex align-items-center flex-grow-1 justify-content-md-center justify-content-end gap-2 mt-2 mt-md-0">
          <div
            className="search-container position-relative"
            style={{ maxWidth: "250px", width: "100%" }}
          >
            <input
              type="text"
              className="form-control search-input"
              placeholder="Buscar..."
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{ paddingLeft: "48px", paddingRight: "10px", fontSize: "16px" }}
            />
            <i
              className="fas fa-search search-icon"
              style={{
                position: "absolute",
                top: "50%",
                left: "16px",
                transform: "translateY(-50%)",
                color: "#888",
                fontSize: "16px",
                pointerEvents: "none"
              }}
            ></i>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
          <Link
            to="/home"
            className="btn btn-primary"
            style={{ padding: "6px 20px", fontSize: "14px", whiteSpace: "nowrap" }}
          >
            Mis Procesos
          </Link>

          <button
            onClick={handleLogout}
            className="btn btn-outline-light"
            style={{ padding: "6px 14px", fontSize: "14px", whiteSpace: "nowrap" }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
