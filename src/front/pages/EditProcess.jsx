import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EditProcess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [processName, setProcessName] = useState("");
  const [processCategory, setProcessCategory] = useState(""); // Podrías necesitar cargar categorías para un <select>
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProcessData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/process/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            navigate("/login");
          }
          const text = await res.text();
          throw new Error(`Error al cargar el proceso: ${text}`);
        }

        const data = await res.json();
        setProcessName(data.process.name);
        setProcessCategory(data.process.category?.id || ""); // Asegúrate de que esto coincida con cómo manejas las categorías
        setSteps(data.steps); // Carga los pasos existentes
      } catch (err) {
        console.error("Error fetching process for editing:", err);
        setError(err.message || "No se pudo cargar el proceso para editar.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProcessData();
  }, [id, navigate]);

  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const handleAddStep = () => {
    setSteps([...steps, { label: "", type: "TEXT", content: "" }]); // Default new step
  };

  const handleRemoveStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const updatedProcessData = {
        name: processName,
        category_id: processCategory, // Asegúrate de que el backend espera category_id
        steps: steps, // Envía el array de pasos completo
      };

      const res = await fetch(`${BACKEND_URL}/process/${id}`, {
        method: "PUT", // O "PATCH" si tu API soporta actualizaciones parciales
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProcessData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error al actualizar el proceso: ${text}`);
      }

      alert("Proceso actualizado exitosamente.");
      navigate(`/process/${id}`); // Volver a la vista de detalles del proceso
    } catch (err) {
      console.error("Error updating process:", err);
      setError(err.message || "Error al actualizar el proceso.");
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando datos del proceso para edición...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-white mb-4">Editar Proceso: {processName}</h2>
      <form onSubmit={handleSubmit} className="card card-dark p-4 shadow-sm border-0">
        <div className="mb-3">
          <label htmlFor="processName" className="form-label text-white">Nombre del Proceso</label>
          <input
            type="text"
            className="form-control"
            id="processName"
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
            required
          />
        </div>

        {/* Campo para la categoría - podrías necesitar un select dinámico */}
        <div className="mb-3">
          <label htmlFor="processCategory" className="form-label text-white">Categoría (ID)</label>
          <input
            type="text" // Cambiar a <select> con <option>s cargadas de tu API de categorías
            className="form-control"
            id="processCategory"
            value={processCategory}
            onChange={(e) => setProcessCategory(e.target.value)}
            required
          />
        </div>

        <h4 className="text-primary mt-4 mb-3">Pasos:</h4>
        {steps.map((step, index) => (
          <div key={index} className="card card-darker p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="m-0 text-white">Paso {index + 1}</h6>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleRemoveStep(index)}
              >
                Eliminar Paso
              </button>
            </div>
            <div className="mb-2">
              <label htmlFor={`stepLabel-${index}`} className="form-label text-white">Etiqueta del Paso</label>
              <input
                type="text"
                className="form-control form-control-sm"
                id={`stepLabel-${index}`}
                value={step.label}
                onChange={(e) => handleStepChange(index, "label", e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor={`stepType-${index}`} className="form-label text-white">Tipo de Contenido</label>
              <select
                className="form-select form-select-sm"
                id={`stepType-${index}`}
                value={step.type}
                onChange={(e) => handleStepChange(index, "type", e.target.value)}
                required
              >
                <option value="TEXT">Texto</option>
                <option value="IMAGE">Imagen (URL)</option>
                <option value="VIDEO">Video (URL)</option>
                <option value="VIDEO_URL">Video (URL de YouTube/Vimeo)</option>
                <option value="PDF">PDF (URL)</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor={`stepContent-${index}`} className="form-label text-white">Contenido</label>
              <textarea
                className="form-control form-control-sm"
                id={`stepContent-${index}`}
                rows="3"
                value={step.content}
                onChange={(e) => handleStepChange(index, "content", e.target.value)}
                required
              ></textarea>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-secondary mt-3" onClick={handleAddStep}>
          <i className="bi bi-plus-lg me-1"></i> Añadir Paso
        </button>

        <div className="d-flex justify-content-end mt-4">
          <button type="button" className="btn btn-outline-secondary me-2" onClick={() => navigate(`/process/${id}`)}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-success">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProcess;