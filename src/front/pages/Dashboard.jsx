import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [processes, setProcesses] = useState([]);
  const navigate = useNavigate();

  const fetchProcesses = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BACKEND_URL}/process`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.error("Error al obtener procesos");
        return;
      }

      const data = await res.json();
      setProcesses(data);
    } catch (err) {
      console.error("Error de conexión:", err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const confirmDelete = window.confirm("¿Seguro que deseas eliminar este proceso?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BACKEND_URL}/process/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error al eliminar:", errorText);
        alert("No se pudo eliminar el proceso.");
        return;
      }

      // Refresca la lista
      setProcesses(processes.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error de red al eliminar:", err);
      alert("Error de conexión al intentar eliminar.");
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Mis Procesos</h2>
        <button className="btn btn-success" onClick={() => navigate("/crear-proceso")}>
          + Crear Proceso
        </button>
      </div>

      {processes.length === 0 ? (
        <p>No hay procesos creados aún.</p>
      ) : (
        <ul className="list-group">
          {processes.map((p) => (
            <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{p.name}</strong><br />
                <small className="text-muted">{p.category}</small>
              </div>
              <div>
                <button
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={() => navigate(`/process/${p.id}`)}
                >
                  Ver
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(p.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
