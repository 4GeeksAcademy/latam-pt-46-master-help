import React from "react";
import logo from "../assets/img/master-help-logo-hz.webp";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
      <div className="container">
        <a className="navbar-brand" href="#hero">
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
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#solution-benefits">
                Beneficios
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#how-it-works">
                Cómo Funciona
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#use-cases">
                Casos de Uso
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#testimonials">
                Testimonios
              </a>
            </li>
          </ul>
          <div className="d-flex ms-lg-3">
            <button className="btn btn-outline-light me-2">Iniciar Sesión</button>
            <button className="btn btn-primary">Prueba Gratis</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
