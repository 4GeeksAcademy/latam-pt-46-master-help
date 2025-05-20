import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [processes, setProcesses] = useState([]);
  const navigate = useNavigate();

  const fetchProcesses = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/process", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setProcesses(data);
  };

  const deleteProcess = async (id) => {
    const token = localStorage.getItem("token");
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar este proceso?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/process/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setProcesses(processes.filter((p) => p.id !== id));
    } else {
      alert("Error al eliminar proceso");
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Mis Procesos</h2>
        <button className="btn btn-primary" onClick={() => navigate("/crear-proceso")}>
          Crear Nuevo Proceso
        </button>
      </div>

      <ul className="list-group">
        {processes.map((p) => (
          <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{p.name}</strong> <small className="text-muted">({p.category})</small>
            </div>
            <div>
              <button className="btn btn-outline-info btn-sm me-2" onClick={() => navigate(`/process/${p.id}`)}>
                Ver Detalle
              </button>
              <button className="btn btn-outline-warning btn-sm me-2" onClick={() => navigate(`/editar-proceso/${p.id}`)}>
                Editar
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={() => deleteProcess(p.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
