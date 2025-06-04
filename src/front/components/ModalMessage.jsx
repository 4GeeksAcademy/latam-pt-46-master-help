import React from "react";

const ModalMessage = ({
    show,
    title = "",
    message,
    onConfirm,
    onCancel,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
}) => {
    if (!show) return null;
    return (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark text-light">
                    <div className="modal-header border-0">
                        {title && <h5 className="modal-title">{title}</h5>}
                        {onCancel && (
                            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onCancel}></button>
                        )}
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer border-0">
                        {onCancel && (
                            <button type="button" className="btn btn-secondary" onClick={onCancel}>
                                {cancelText}
                            </button>
                        )}
                        {onConfirm && (
                            <button type="button" className="btn btn-primary" onClick={onConfirm}>
                                {confirmText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalMessage;