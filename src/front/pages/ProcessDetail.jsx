import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProcessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [process, setProcess] = useState(null);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState("");

  const fetchProcessDetail = async () => {
    const token = localStorage.getItem("token");
    console.log("🟡 ID del proceso:", id);
    console.log("🟡 Token:", token);

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

      <div>
        {steps.map((step, idx) => (
          <div key={idx} className="mb-4 p-3 border rounded bg-light">
            <h5>Paso {idx + 1}: {step.label}</h5>

            {step.type === "TEXT" && <p>{step.content}</p>}

            {step.type === "VIDEO_URL" && (
              <div className="ratio ratio-16x9">
                <iframe
                  src={step.content}
                  title={`video-${idx}`}
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {step.type === "IMAGE" && (
              <img src={step.content} alt="Paso imagen" className="img-fluid" />
            )}

            {step.type === "PDF" && (
              <a href={step.content} target="_blank" rel="noreferrer">
                Ver PDF
              </a>
            )}

            {step.type === "VIDEO" && (
              <video className="w-100" controls>
                <source src={step.content} type="video/mp4" />
                Tu navegador no soporta video HTML5.
              </video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessDetail;
