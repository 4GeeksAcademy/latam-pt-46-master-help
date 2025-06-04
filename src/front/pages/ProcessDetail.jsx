import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import ModalMessage from "../components/ModalMessage";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const StepContent = ({ step }) => {
  switch (step.type) {
    case "TEXT":
      return <p className="card-text text-body">{step.content}</p>;
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
    default:
      return null;
  }
};

const ProcessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [process, setProcess] = useState({});
  const [steps, setSteps] = useState([]);
  const [editingStep, setEditingStep] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editFile, setEditFile] = useState(null);

  // Modal state for confirmation
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    confirmText: "Eliminar",
    cancelText: "Cancelar"
  });

  // Modal for info/success/error
  const [infoModal, setInfoModal] = useState({
    show: false,
    title: "",
    message: "",
    onClose: null
  });

  // Store which step is pending deletion
  const [pendingDeleteStepId, setPendingDeleteStepId] = useState(null);

  useEffect(() => {
    fetchProcessDetail();
  }, [id]);

  const fetchProcessDetail = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/process/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setProcess(data.process || {});
      setSteps(data.steps || []);
    }
  };

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
        setInfoModal({
          show: true,
          title: "Error",
          message: "No se pudo actualizar el paso.",
          onClose: () => setInfoModal((prev) => ({ ...prev, show: false }))
        });
      }
    } else {
      const res = await fetch(`${BACKEND_URL}/step/${editingStep.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          label: editLabel,
          content: editContent,
        }),
      });
      if (res.ok) {
        fetchProcessDetail();
        setEditingStep(null);
      } else {
        setInfoModal({
          show: true,
          title: "Error",
          message: "No se pudo actualizar el paso.",
          onClose: () => setInfoModal((prev) => ({ ...prev, show: false }))
        });
      }
    }
  };

  // Show modal instead of window.confirm
  const handleDeleteStep = (stepId) => {
    setPendingDeleteStepId(stepId);
    setModal({
      show: true,
      title: "Eliminar Paso",
      message: "¿Seguro que deseas eliminar este paso?",
      onConfirm: () => confirmDeleteStep(stepId),
      onCancel: () => setModal((prev) => ({ ...prev, show: false })),
      confirmText: "Eliminar",
      cancelText: "Cancelar"
    });
  };

  const confirmDeleteStep = async (stepId) => {
    setModal((prev) => ({ ...prev, show: false }));
    setPendingDeleteStepId(null);
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/step/${stepId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setSteps(steps.filter((s) => s.id !== stepId));
      setInfoModal({
        show: true,
        title: "Eliminado",
        message: "El paso fue eliminado correctamente.",
        onClose: () => setInfoModal((prev) => ({ ...prev, show: false }))
      });
    } else {
      setInfoModal({
        show: true,
        title: "Error",
        message: "No se pudo eliminar el paso.",
        onClose: () => setInfoModal((prev) => ({ ...prev, show: false }))
      });
    }
  };

  const stepBtnEditStyle = {
    width: "36px",
    height: "36px",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    border: "1px solid #00bfff",
    background: "transparent",
    color: "#00bfff",
    transition: "background 0.2s, color 0.2s, border 0.2s",
  };

  const stepBtnDangerStyle = {
    width: "36px",
    height: "36px",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    border: "1px solid #dc3545",
    background: "transparent",
    color: "#dc3545",
    transition: "background 0.2s, color 0.2s, border 0.2s",
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
          return (
            <div key={step.id} className="col-12 mb-4">
              <div className="card card-dark h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title text-primary mb-0">
                      Paso {idx + 1}: {step.label}
                    </h5>
                    <div className="d-flex gap-2">
                      <button
                        style={stepBtnEditStyle}
                        className="btn btn-outline-info btn-sm d-flex justify-content-center align-items-center"
                        onClick={() => handleEditStepClick(step)}
                        title="Editar Paso"
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            height: "100%",
                            lineHeight: 0,
                          }}
                        >
                          <Pencil size={18} />
                        </span>
                      </button>
                      <button
                        style={stepBtnDangerStyle}
                        className="btn btn-outline-danger btn-sm d-flex justify-content-center align-items-center"
                        onClick={() => handleDeleteStep(step.id)}
                        title="Eliminar Paso"
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            height: "100%",
                            lineHeight: 0,
                          }}
                        >
                          <i
                            className="bi bi-trash"
                            style={{
                              fontSize: "1.1rem",
                              marginTop: "15px",
                            }}
                          ></i>
                        </span>
                      </button>
                    </div>
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
    </div>
  );
};

export default ProcessDetail;