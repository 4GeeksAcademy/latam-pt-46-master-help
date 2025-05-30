import React, { useState } from "react";
import logo from "../assets/img/master-help-logo-hz.webp";
import { Link, useNavigate } from "react-router-dom";
import { NavHashLink } from 'react-router-hash-link';
import "/workspaces/latam-pt-46-master-help/src/front/index.css";

const Navbar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  
  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar custom-toggler">
      <div className="container">
        <a className="navbar-brand" href="/#hero">
          <img src={logo} alt="Master Help Logo" height="100" />
        </a>

        
        <div className="d-flex align-items-center ms-auto">
          
          <div className="search-container me-2">
            <input
              type="text"
              className="form-control search-input"
              placeholder={isFocused ? "" : "      Buscar..."}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{ width: "200px" }}
            />
            {!isFocused && <i className="fas fa-search search-icon"></i>}
          </div>

          
          <Link
            to="/dashboard"
            className="btn btn-info me-4"
            style={{
              padding: "6px 20px",
              fontSize: "14px",
              whiteSpace: "nowrap",
            }}
          >
            Mis Procesos
          </Link>

          
          <button onClick={handleLogout} className="btn btn-outline-light ms-4" style={{ padding: "4px 10px", fontSize: "14px", whiteSpace: "nowrap",}} >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;