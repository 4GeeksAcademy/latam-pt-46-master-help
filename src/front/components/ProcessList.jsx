import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Info, Pencil, Trash2 } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProcessList = ({ categoryId, processes, isLoading, error, fetched }) => {
  const navigate = useNavigate();

  const handleDeleteClick = async (processId, processName, e) => {
    e.stopPropagation(); // Prevent event bubbling
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
          <div key={process.id} className="col-auto">
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-header">
                <h5 className="card-title mb-0">{process.name}</h5>
              </div>
              <div className="card-body d-flex flex-column">
                <p className="card-text text-muted small flex-grow-1">
                  {process.description ? process.description : "Sin descripción."}
                </p>
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-info btn-sm d-flex justify-content-center align-items-center"
                    style={{ width: "32px", height: "32px", padding: "0" }}
                    onClick={(e) => handleInfoClick(process.id, e)}
                    title="Ver Información"
                  >
                    <Info size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm d-flex justify-content-center align-items-center"
                    style={{ width: "32px", height: "32px", padding: "0" }}
                    onClick={(e) => handleDeleteClick(process.id, process.name, e)}
                    title="Eliminar Proceso"
                  >
                    <Trash2 size={16} />
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