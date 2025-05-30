import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EditarProceso = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchProcess = async () => {
    const token = localStorage.getItem("token");
<<<<<<< HEAD
    const res = await fetch(`${BACKEND_URL}/api/process/${id}`, {
=======
    const res = await fetch(`${BACKEND_URL}/process/${id}`, {
>>>>>>> development
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setName(data.process.name);
    setCategory(data.process.category);
    setSteps(data.steps);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

<<<<<<< HEAD
    const res = await fetch(`${BACKEND_URL}/api/process/${id}`, {
=======
    const res = await fetch(`${BACKEND_URL}/process/${id}`, {
>>>>>>> development
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        category,
      }),
    });

    if (res.ok) {
      setMessage("Proceso actualizado correctamente.");
      setTimeout(() => navigate("/dashboard"), 1500);
    } else {
      setMessage("Error al actualizar el proceso.");
    }
  };

  useEffect(() => {
    fetchProcess();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Editar Proceso</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label>Nombre</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Categoría</label>
          <input
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Guardar Cambios
        </button>
      </form>

      <hr />
      <h4>Pasos (solo lectura)</h4>
      <ul className="list-group">
        {steps.map((step, i) => (
          <li key={i} className="list-group-item">
            <strong>{step.label}</strong> ({step.type})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditarProceso;
