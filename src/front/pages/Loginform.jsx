import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/home.css";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const login = async (email, password, isLogin) => {
  const path = isLogin ? "user/login" : "user/signin";
  const response = await fetch(`${BACKEND_URL}/${path}`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  let data = null;
  const text = await response.text();
  if (text) {
    data = JSON.parse(text);
  }
  if (response.ok) {
    if (response.status === 409) {
      return [false, "signin", 409];
    }
    return [data, path, 200];
  } else {
    // Try to get backend error code/message
    return [false, path, response.status];
  }
}

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname == "/login";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side password length check for registration
    if (!isLogin && password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const [response, path, type] = await login(email, password, isLogin);

    if (response === false) {
      if (type === 409) {
        setMessage("El correo ya está registrado.");
      } else if (type === 400 && path === "signin") {
        setMessage("La contraseña debe tener al menos 6 caracteres.");
      } else if (path === "signin") {
        setMessage("Error al crear la cuenta. Inténtalo de nuevo.");
      } else if (path === "login") {
        setMessage("Credenciales Incorrectas");
      }
      return;
    }

    // Success
    if (isLogin) {
      localStorage.setItem("token", response.access_token);
      setMessage("Inicio de sesión exitoso.");
      navigate("/home");
    } else {
      setMessage("Cuenta creada exitosamente. Ahora puedes iniciar sesión.");
      navigate("/login");
    }
  };


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}>
        <h3 className="text-center mb-4 highlight">{isLogin ? "Iniciar Sesión" : "Registrarse"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          <button type="submit" className="btn btn-outline-light w-100 btn-lg">
            {isLogin ? "Ingresar" : "Crear Cuenta"}
          </button>
          {message && (
            <div className="alert alert-info mt-3 text-center" role="alert">
              {message}
            </div>
          )}
        </form>
        <div className="text-center mt-3">
          {isLogin ? (
            <small>
              ¿No tienes cuenta? <a href="/signin">Regístrate</a>
            </small>
          ) : (
            <small>
              ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
            </small>
          )}
        </div>
      </div>
    </div>
  );
};


