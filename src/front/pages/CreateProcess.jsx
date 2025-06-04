import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalMessage from "../components/ModalMessage";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CreateProcess = () => {
  const [name, setName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState("");
  const [processDescription, setProcessDescription] = useState("");
  const [processName, setProcessName] = useState("");
  const [modal, setModal] = useState({ show: false, message: "", onConfirm: null, onCancel: null });
  const [infoModal, setInfoModal] = useState({ show: false, message: "", onClose: null });
  const [pendingRemoveIndex, setPendingRemoveIndex] = useState(null);

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
  };

  const handleRemoveStep = (index) => {
    setPendingRemoveIndex(index);
    setModal({
      show: true,
      title: "Eliminar Paso",
      message: "¿Seguro que deseas eliminar este paso?",
      onConfirm: () => confirmRemoveStep(index),
      onCancel: () => setModal((prev) => ({ ...prev, show: false })),
      confirmText: "Eliminar",
      cancelText: "Cancelar"
    });
  };

  const confirmRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
    setModal((prev) => ({ ...prev, show: false }));
    setPendingRemoveIndex(null);
  };

  const handleChangeStep = (i, field, value) => {
    const updated = [...steps];
    updated[i][field] = value;
    setSteps(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!processName.trim()) {
      setInfoModal({
        show: true,
        title: "Error",
        message: "El nombre del proceso es obligatorio.",
        onClose: () => setInfoModal((prev) => ({ ...prev, show: false }))
      });
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/process/create/${category_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: processName.trim(), description: processDescription }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        setInfoModal({
          show: true,
          title: "Error",
          message: "No se pudo crear el proceso.",
          onClose: () => setInfoModal((prev) => ({ ...prev, show: false }))
        });
        console.error("Error al crear proceso:", errorText);
        return;
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
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadRes.ok) {
          setInfoModal({
            show: true,
            title: "Error",
            message: "No se pudo subir uno de los pasos.",
            onClose: () => setInfoModal((prev) => ({ ...prev, show: false }))
          });
          console.error("Error al subir paso:", await uploadRes.text());
          return;
        }
      }

      setMessage("Proceso creado exitosamente.");
      setName("");
      setSteps([]);
      setInfoModal({
        show: true,
        title: "Éxito",
        message: "Proceso creado exitosamente.",
        onClose: () => setInfoModal((prev) => ({ ...prev, show: false }))
      });
    } catch (err) {
      setInfoModal({
        show: true,
        title: "Error",
        message: "Ocurrió un error inesperado.",
        onClose: () => setInfoModal((prev) => ({ ...prev, show: false }))
      });
      console.error("Error general:", err);
    }
  };

  return (
    <div className="container mt-5">
      <ModalMessage
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
      />
      <ModalMessage
        show={infoModal.show}
        title={infoModal.title}
        message={infoModal.message}
        onConfirm={infoModal.onClose}
        onCancel={null}
        confirmText="Cerrar"
        cancelText=""
      />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Crear Nuevo Proceso</h2>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/home")}
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
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Descripción del proceso (opcional)</label>
          <textarea
            className="form-control"
            value={processDescription}
            onChange={(e) => setProcessDescription(e.target.value)}
            placeholder="Describe una breve descripción del proceso"
          />
        </div>

        <h4>Pasos</h4>
        {steps.map((step, i) => (
          <div key={i} className="mb-4 p-3 border rounded bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="mb-0">Nombre del paso</label>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleRemoveStep(i)}
                title="Eliminar paso"
              >
                <i className="bi bi-dash-circle"></i> Eliminar
              </button>
            </div>
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
