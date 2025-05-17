import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";


const login = async (email, password, isLogin) => {
  const path = isLogin ? "login" : "signin" 
    const response = await fetch(`https://solid-telegram-5jr4q95vxq7377vx-3001.app.github.dev/api/user/${path}`, {
  method : 'POST',
  body: JSON.stringify({email, password}),
  headers: {
    'Content-Type':'application/json'
  }

    });
    const data = await response.json();
    console.log("ESTA ES LA Respuesta:", data); // Aquí ves si hay token
    if (response.ok) {
      const data = await response.json();
      console.log("este es:", data)
      return data;
    } else{
      return false;
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
  

    const response = await login(email, password, isLogin);
    if (response==false) {
      setMessage("Credenciales Incorrectas")
    }else if(isLogin){
      localStorage.setItem("token", response.token);
      setMessage("Inicio de sesión exitoso.");
      navigate("/dashboard");//reemplazar dashboard por la pagina que vaya luego del login
    } else{
      navigate("/login")
    }

  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}>
        <h3 className="text-center mb-4 text-primary">{isLogin ? "Iniciar Sesión" : "Registrarse"}</h3>
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
          <button type="submit" className="btn btn-primary w-100 btn-lg">
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


