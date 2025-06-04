import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const StepContent = ({ step }) => {
  switch (step.type) {
    case "TEXT":
      return (
        <p className="card-text text-body">
          {step.content}
        </p>
      );

    case "IMAGE":
      return (
        <img
          src={step.content}
          alt="Paso imagen"
          className="img-fluid rounded border"
          style={{ objectFit: "cover", maxHeight: "320px", width: "100%" }}
        />
      );

    case "VIDEO":
      return (
        <video className="w-100 rounded" controls>
          <source src={step.content} type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>
      );

    case "VIDEO_URL":
      return (
        <div className="ratio ratio-16x9">
          <iframe
            src={step.content}
            title="Paso video"
            allowFullScreen
            className="rounded"
          ></iframe>
        </div>
      );

    case "PDF":
      return (
        <a
          href={step.content}
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline-primary mt-2"
        >
          Ver documento PDF
        </a>
      );

    default:
      return <p className="text-muted">Tipo de contenido no soportado.</p>;
  }
};

const ProcessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [process, setProcess] = useState(null);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState("");
  const [editingStep, setEditingStep] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editFile, setEditFile] = useState(null);

  const fetchProcessDetail = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No hay token de autenticación.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/process/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Error al obtener el proceso:", text);
        setError("No se pudo cargar el proceso. Verifica que tengas acceso.");
        return;
      }

      const data = await res.json();
      setProcess(data.process);
      setSteps(data.steps);
    } catch (err) {
      console.error("⚠️ Error de red:", err);
      setError("Ocurrió un error inesperado al cargar los datos.");
    }
  };

  useEffect(() => {
    if (id) fetchProcessDetail();
  }, [id]);

  const handleEditStepClick = (step) => {
    setEditingStep(step);
    setEditLabel(step.label);
    setEditContent(step.content);
    setEditFile(null);
  };

  const handleEditStepSave = async () => {
    const token = localStorage.getItem("token");
    const isMedia = ["IMAGE", "PDF", "VIDEO"].includes(editingStep.type);

    if (isMedia && editFile) {
      // Send as multipart/form-data
      const formData = new FormData();
      formData.append("label", editLabel);
      formData.append("type", editingStep.type);
      formData.append("order", editingStep.order);
      formData.append("file", editFile);

      const res = await fetch(`${BACKEND_URL}/step/${editingStep.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        fetchProcessDetail();
        setEditingStep(null);
      } else {
        alert("No se pudo actualizar el paso.");
      }
    } else {
      // Send as JSON
      const res = await fetch(`${BACKEND_URL}/step/${editingStep.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          label: editLabel,
          content: editContent,
          // add type/order if you want to allow editing them
        }),
      });
      if (res.ok) {
        fetchProcessDetail();
        setEditingStep(null);
      } else {
        alert("No se pudo actualizar el paso.");
      }
    }
  };

  if (error) {
    return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  }

  if (!process) {
    return <div className="text-center mt-5">Cargando proceso...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white">Proceso: {process.name}</h2>
        <button
          className="btn btn-outline-light"
          onClick={() => navigate("/home")}
        >
          ← Volver al Dashboard
        </button>
      </div>

      <h5 className="text-light-emphasis mb-4">
        Categoría: {process.category?.name || "Sin categoría"}
      </h5>

      <div className="row">
        {steps.map((step, idx) => {
          const isMedia = ["IMAGE", "VIDEO", "VIDEO_URL"].includes(step.type);
          return (
            <div key={idx} className={isMedia ? "col-md-6 mb-4" : "col-12 mb-4"}>
              <div className="card card-dark h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title text-primary mb-0">
                      Paso {idx + 1}: {step.label}
                    </h5>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEditStepClick(step)}
                      title="Editar Paso"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                  {editingStep?.id === step.id ? (
                    <div>
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                      />
                      <textarea
                        className="form-control mb-2"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleEditStepSave}
                      >
                        Guardar
                      </button>
                      <button
                        className="btn btn-secondary btn-sm ms-2"
                        onClick={() => setEditingStep(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <StepContent step={step} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editingStep && (
        <div className="modal show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Paso</h5>
                <button type="button" className="btn-close" onClick={() => setEditingStep(null)} />
              </div>
              <div className="modal-body">
                <label>Nombre del paso</label>
                <input
                  className="form-control mb-2"
                  value={editLabel}
                  onChange={e => setEditLabel(e.target.value)}
                />
                <label>Contenido</label>
                <textarea
                  className="form-control"
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                />
                {["IMAGE", "PDF", "VIDEO"].includes(editingStep?.type) && (
                  <div className="mb-2">
                    <label>Archivo nuevo (opcional)</label>
                    <input
                      className="form-control"
                      type="file"
                      onChange={e => setEditFile(e.target.files[0])}
                    />
                    <small className="text-muted">Si seleccionas un archivo, reemplazará el actual.</small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingStep(null)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleEditStepSave}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessDetail;
