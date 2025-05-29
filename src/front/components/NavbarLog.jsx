import React, { useState } from "react";
import logo from "../assets/img/master-help-logo-hz.webp";
import { Link } from "react-router-dom";
import { NavHashLink } from 'react-router-hash-link';
import "/workspaces/latam-pt-46-master-help/src/front/index.css";


const Navbar = () => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar custom-toggler">
      <div className="container">
        <a className="navbar-brand" href="/#hero">
          <img src={logo} alt="Master Help Logo" height="100" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

            <Link to="/dashboard" className="btn btn-outline-light me-2">
              Mis procesos
            </Link>
           <div className="d-flex align-items-center ms-lg-3 me-3">
            <div className="search-container">
              <input
                type="text"
                className="form-control search-input"
                placeholder={isFocused ? "" : "      Buscar..."}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {!isFocused && <i className="fas fa-search search-icon"></i>}
              </div>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;