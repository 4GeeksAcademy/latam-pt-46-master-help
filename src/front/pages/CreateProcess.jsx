import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CreateProcess = () => {
  const [name, setName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { category_id } = useParams();

  // Cargar nombre de la categoría desde backend usando el category_id
  useEffect(() => {
    const fetchCategory = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${BACKEND_URL}/categories/${category_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("No se pudo cargar la categoría");
        const data = await res.json();
        setCategoryName(data.name);
      } catch (error) {
        console.error("Error al cargar categoría:", error);
        setCategoryName("Categoría no encontrada");
      }
    };

    if (category_id) fetchCategory();
  }, [category_id]);

  const handleAddStep = () => {
    setSteps([...steps, { label: "", type: "TEXT", content: "", file: null }]);
  };

  const handleChangeStep = (i, field, value) => {
    const updated = [...steps];
    updated[i][field] = value;
    setSteps(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!name.trim()) {
      alert("El nombre del proceso es obligatorio.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/process/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          category: parseInt(category_id),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error al crear proceso:", errorText);
        return alert("No se pudo crear el proceso.");
      }

      const data = await res.json();
      const processId = data.id;

      // Subir pasos
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const formData = new FormData();
        formData.append("process_id", processId);
        formData.append("label", step.label);
        formData.append("type", step.type);
        formData.append("order", i);

        if (["IMAGE", "PDF", "VIDEO"].includes(step.type)) {
          formData.append("file", step.file);
        } else {
          formData.append("content", step.content);
        }

        const uploadRes = await fetch(`${BACKEND_URL}/step/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadRes.ok) {
          console.error("Error al subir paso:", await uploadRes.text());
          return alert("No se pudo subir uno de los pasos.");
        }
      }

      setMessage("Proceso creado exitosamente.");
      setName("");
      setSteps([]);
    } catch (err) {
      console.error("Error general:", err);
      alert("Ocurrió un error inesperado.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Crear Nuevo Proceso</h2>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/dashboard")}
        >
          ← Volver al Dashboard
        </button>
      </div>

      <h5 className="mb-4 text-muted">Categoría: {categoryName}</h5>

      {message && <div className="alert alert-success">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre del proceso</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <h4>Pasos</h4>
        {steps.map((step, i) => (
          <div key={i} className="mb-4 p-3 border rounded bg-light">
            <label>Nombre del paso</label>
            <input
              className="form-control mb-2"
              value={step.label}
              onChange={(e) => handleChangeStep(i, "label", e.target.value)}
              required
            />
            <label>Tipo</label>
            <select
              className="form-control mb-2"
              value={step.type}
              onChange={(e) => handleChangeStep(i, "type", e.target.value)}
            >
              <option value="TEXT">Texto</option>
              <option value="IMAGE">Imagen</option>
              <option value="PDF">PDF</option>
              <option value="VIDEO">Video</option>
              <option value="VIDEO_URL">URL de Video</option>
            </select>

            {["TEXT", "VIDEO_URL"].includes(step.type) && (
              <textarea
                className="form-control"
                placeholder="Contenido del paso"
                value={step.content}
                onChange={(e) =>
                  handleChangeStep(i, "content", e.target.value)
                }
              />
            )}

            {["IMAGE", "PDF", "VIDEO"].includes(step.type) && (
              <input
                className="form-control"
                type="file"
                onChange={(e) =>
                  handleChangeStep(i, "file", e.target.files[0])
                }
              />
            )}
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={handleAddStep}
        >
          Agregar Paso +
        </button>

        <button type="submit" className="btn btn-primary w-100">
          Guardar Proceso
        </button>
      </form>
    </div>
  );
};

export default CreateProcess;
