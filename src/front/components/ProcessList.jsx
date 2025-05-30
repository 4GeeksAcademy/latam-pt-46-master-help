import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProcessList = ({ categoryId, processes, isLoading, error, fetched }) => {
  const navigate = useNavigate();

  const handleDeleteClick = async (processId, processName, e) => {
    e.stopPropagation();
    const confirmed = window.confirm(`¿Deseas eliminar el proceso: ${processName}?`);
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/process/${processId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert(`Error al eliminar: ${errorText}`);
      } else {
        alert("Proceso eliminado correctamente.");
        window.location.reload();
      }
    } catch (err) {
      alert("Error al eliminar el proceso.");
      console.error(err);
    }
  };

  const handleInfoClick = (processId, e) => {
    e?.stopPropagation();
    navigate(`/process/${processId}`);
  };

  let content;

  if (isLoading) {
    content = (
      <div className="p-4 text-center text-muted">
        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
        Cargando procesos...
      </div>
    );
  } else if (error) {
    content = (
      <div className="alert alert-danger text-center p-3">
        Error: {error}
      </div>
    );
  } else if (fetched && processes.length === 0) {
    content = (
      <div className="text-center text-muted p-3 fst-italic">
        No hay procesos en esta categoría.
      </div>
    );
  } else if (fetched && processes.length > 0) {
    content = (
      <div className="row g-4">
        {processes.map((process) => (
          <div key={process.id} className="col-md-6">
            <div
              className="card card-dark h-100 process-item"
              onClick={() => handleInfoClick(process.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <span className="fs-5 text-white">{process.name}</span>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm btn-glow"
                    onClick={(e) => handleInfoClick(process.id, e)}
                    title="Ver Información"
                  >
                    <i className="bi bi-info-circle"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm btn-glow"
                    onClick={(e) => handleDeleteClick(process.id, process.name, e)}
                    title="Eliminar Proceso"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    content = (
      <div className="text-center text-muted p-3 fst-italic">
        Expanda para ver los procesos.
      </div>
    );
  }

  const showCreateButton = fetched || !isLoading;

  return (
    <div className="processes-list-wrapper py-3">
      {content}
      {showCreateButton && (
        <div className="mt-4 text-end">
          <Link
            to={`/crear-proceso/${categoryId}`}
            className="btn btn-primary btn-glow"
          >
            <i className="bi bi-plus-lg me-2"></i>
            Agregar Nuevo Proceso
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProcessList;
