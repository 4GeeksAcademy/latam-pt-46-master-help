import React, { useState, useEffect } from "react";

const CreateCategoryButton = ({ isOpen, onClose, onCategoryCreated, backendUrl, token }) => {
    const [categoryName, setCategoryName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Reset form when modal is opened/closed or props change
    useEffect(() => {
        if (isOpen) {
            setCategoryName("");
            setError("");
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) {
            setError("El nombre de la categoría no puede estar vacío.");
            return;
        }
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(`${backendUrl}/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: categoryName }),
            });

            const data = await res.json();

            if (!res.ok) {
                let errorMessage = "Error al crear la categoría.";
                if (data && (data.message || data.error)) {
                    errorMessage = data.message || data.error;
                }
                if (res.status === 401 || res.status === 403) {
                    errorMessage += " Sesión inválida o expirada. Por favor, inicie sesión de nuevo.";
                    // Consider calling a global logout function if available, or let parent handle it
                }
                setError(errorMessage);
                setIsLoading(false);
                return;
            }

            onCategoryCreated(data); // Pass the newly created category object
            // No need to setCategoryName("") here, useEffect for isOpen will handle it
            // No need to setIsLoading(false) here, it's done before return or in onClose
            onClose(); // Close the modal
        } catch (err) {
            console.error("Error de conexión al crear categoría:", err);
            setError("Error de conexión al intentar crear la categoría.");
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="modal"
            tabIndex="-1"
            style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)", // Backdrop
            }}
            onClick={(e) => { // Optional: close on backdrop click
                if (e.target === e.currentTarget && !isLoading) {
                    onClose();
                }
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Crear Nueva Categoría</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                disabled={isLoading}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger py-2">{error}</div>}
                            <div className="mb-3">
                                <label htmlFor="categoryNameInput" className="form-label">
                                    Nombre de la Categoría
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="categoryNameInput"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    autoFocus // Focus on input when modal opens
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span className="ms-1">Guardando...</span>
                                    </>
                                ) : (
                                    "Guardar Categoría"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCategoryButton;