// src/components/GenericCreateModal.jsx
import React, { useState, useEffect } from "react";

const GenericCreateModal = ({
    isOpen,
    onClose,
    onItemCreated, // Generic callback for when an item is successfully created
    token,
    submitUrl, // The full URL to POST the new item to
    itemTypeLabel, // e.g., "Categoría", "Proceso" (used in error messages/placeholders)
    itemNameInputLabel, // e.g., "Nombre de la Categoría"
    modalTitleText, // e.g., "Crear Nueva Categoría"
    submitButtonTextDefault, // e.g., "Guardar Categoría"
    submitButtonTextLoading, // e.g., "Guardando..."
    inputId, // Unique ID for the input field for accessibility and testing
}) => {
    const [itemName, setItemName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Reset form when modal is opened or relevant props change
    useEffect(() => {
        if (isOpen) {
            setItemName("");
            setError("");
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!itemName.trim()) {
            setError(`El nombre del ${itemTypeLabel.toLowerCase()} no puede estar vacío.`);
            return;
        }
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(submitUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: itemName.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                let errorMessage = `Error al crear el ${itemTypeLabel.toLowerCase()}.`;
                if (data && (data.message || data.error)) {
                    errorMessage = data.message || data.error;
                }
                if (res.status === 401 || res.status === 403) {
                    errorMessage += " Sesión inválida o expirada. Por favor, inicie sesión de nuevo.";
                }
                setError(errorMessage);
                setIsLoading(false);
                return;
            }

            onItemCreated(data); // Pass the newly created item object
            onClose(); // Close the modal on success
        } catch (err) {
            console.error(`Error de conexión al crear ${itemTypeLabel.toLowerCase()}:`, err);
            setError(`Error de conexión al intentar crear el ${itemTypeLabel.toLowerCase()}.`);
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
                            <h5 className="modal-title">{modalTitleText}</h5>
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
                                <label htmlFor={inputId} className="form-label">
                                    {itemNameInputLabel}
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id={inputId}
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
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
                                        <span className="ms-1">{submitButtonTextLoading}</span>
                                    </>
                                ) : (
                                    submitButtonTextDefault
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GenericCreateModal;