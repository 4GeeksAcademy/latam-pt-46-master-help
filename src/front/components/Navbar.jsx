import React from "react";
import logo from "../assets/img/master-help-logo-hz.webp";
import { Link } from "react-router-dom";
<<<<<<< HEAD

const Navbar = () => {
=======
import { NavHashLink } from 'react-router-hash-link';
import "/workspaces/latam-pt-46-master-help/src/front/index.css";


const Navbar = () => {
  
>>>>>>> development
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
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
<<<<<<< HEAD
            <li className="nav-item">
              <a className="nav-link" href="/#solution-benefits">
                Beneficios
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#how-it-works">
                Cómo Funciona
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#use-cases">
                Casos de Uso
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#testimonials">
                Testimonios
              </a>
            </li>
          </ul>
          <div className="d-flex ms-lg-3">
           <Link to="/login" className="btn btn-outline-light me-2">
              Iniciar Sesión
            </Link>
            <Link to="/dashboard" className="btn btn-outline-light me-2">
              Mis procesos
            </Link>
            <Link to="/signin" className="btn btn-primary">
              Registrate
            </Link>
=======

            <NavHashLink
              to="/#solution-benefits" className="nav-item nav-link">
              <a className="nav-link" href="/#solution-benefits">
                Beneficios
              </a>
            </NavHashLink>

            <NavHashLink
              to="/#how-it-works" className="nav-item nav-link">
              <a className="nav-link" href="/#how-it-works">
                Cómo Funciona
              </a>
            </NavHashLink>

            <NavHashLink
              to="/#use-cases" className="nav-item nav-link">
              <a className="nav-link" href="/#use-cases">
                Casos de uso
              </a>
            </NavHashLink>

            <NavHashLink
              to="/#testimonials" className="nav-item nav-link">
              <a className="nav-link" href="/#testimonials">
                Testimonios
              </a>
            </NavHashLink>


          </ul>

          <div className="d-flex ms-lg-3">
            <Link to="/login" className="btn btn-outline-light me-2">
              Iniciar Sesión
            </Link>           
            <Link to="/signin" className="btn btn-primary">
              Registrate
            </Link>

>>>>>>> development
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;