<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
=======
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
>>>>>>> development

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CreateProcess = () => {
  const [name, setName] = useState("");
<<<<<<< HEAD
  const [category, setCategory] = useState("");
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAddStep = () => {
    setSteps([
      ...steps,
      { label: "", type: "TEXT", content: "", file: null }
    ]);
=======
  const [categoryName, setCategoryName] = useState("");
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { category_id } = useParams();

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
>>>>>>> development
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
<<<<<<< HEAD
      const res = await fetch(`${BACKEND_URL}/process/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim()
        })
=======
      const res = await fetch(`${BACKEND_URL}/process/create/${category_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
>>>>>>> development
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error al crear proceso:", errorText);
<<<<<<< HEAD
        return alert("No se pudo crear el proceso. Revisa consola.");
=======
        return alert("No se pudo crear el proceso.");
>>>>>>> development
      }

      const data = await res.json();
      const processId = data.id;

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
<<<<<<< HEAD
            Authorization: `Bearer ${token}`
          },
          body: formData
=======
            Authorization: `Bearer ${token}`,
          },
          body: formData,
>>>>>>> development
        });

        if (!uploadRes.ok) {
          console.error("Error al subir paso:", await uploadRes.text());
<<<<<<< HEAD
          return alert("No se pudo subir uno de los pasos. Revisa consola.");
=======
          return alert("No se pudo subir uno de los pasos.");
>>>>>>> development
        }
      }

      setMessage("Proceso creado exitosamente.");
      setName("");
<<<<<<< HEAD
      setCategory("");
=======
>>>>>>> development
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
<<<<<<< HEAD
          onClick={() => navigate("/dashboard")}
=======
          onClick={() => navigate("/home")}
>>>>>>> development
        >
          ← Volver al Dashboard
        </button>
      </div>

<<<<<<< HEAD
=======
      <h5 className="mb-4 text-muted">Categoría: {categoryName}</h5>

>>>>>>> development
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
<<<<<<< HEAD
        <div className="mb-4">
          <label>Categoría</label>
          <input
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
=======
>>>>>>> development

        <h4>Pasos</h4>
        {steps.map((step, i) => (
          <div key={i} className="mb-4 p-3 border rounded bg-light">
            <label>Nombre del paso</label>
            <input
              className="form-control mb-2"
              value={step.label}
<<<<<<< HEAD
              onChange={(e) =>
                handleChangeStep(i, "label", e.target.value)
              }
=======
              onChange={(e) => handleChangeStep(i, "label", e.target.value)}
>>>>>>> development
              required
            />
            <label>Tipo</label>
            <select
              className="form-control mb-2"
              value={step.type}
<<<<<<< HEAD
              onChange={(e) =>
                handleChangeStep(i, "type", e.target.value)
              }
=======
              onChange={(e) => handleChangeStep(i, "type", e.target.value)}
>>>>>>> development
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
