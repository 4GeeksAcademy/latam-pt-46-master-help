import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const StepContent = ({ step }) => {
  switch (step.type) {
    case "TEXT":
      return <p className="card-text">{step.content}</p>;

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

  if (error) {
    return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  }

  if (!process) {
    return <div className="text-center mt-5">Cargando proceso...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Proceso: {process.name}</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/home")}>
          ← Volver al Dashboard
        </button>
      </div>

      <h5 className="text-muted mb-4">
        Categoría: {process.category?.name || "Sin categoría"}
      </h5>

      <div className="row">
        {steps.map((step, idx) => {
          const isMedia = ["IMAGE", "VIDEO", "VIDEO_URL"].includes(step.type);
          return (
            <div key={idx} className={isMedia ? "col-md-6 mb-4" : "col-12 mb-4"}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title">Paso {idx + 1}: {step.label}</h5>
                  <StepContent step={step} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessDetail;
