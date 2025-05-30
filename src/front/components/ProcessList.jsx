import React from 'react';
import { Link } from 'react-router-dom';

const ProcessList = ({
    categoryId,
    processes,
    isLoading,
    error,
    fetched,
}) => {
    let content;

    const handleDeleteClick = (processId, processName, e) => {
        e.stopPropagation();
        window.alert(`(Placeholder) Delete Process: ${processName}?`);
    };

    const handleInfoClick = (processId, processName, e) => {
        e.stopPropagation();
        window.alert(`(Placeholder) Show Info for: ${processName}`);
    };

    if (isLoading) {
        content = <div className="p-3 text-center text-muted"><div className="spinner-border spinner-border-sm me-2" role="status"></div>Cargando procesos...</div>;
    } else if (error) {
        content = <div className="alert alert-danger p-3 text-center">Error: {error}</div>;
    } else if (fetched && processes.length === 0) {
        content = <div className="p-3 text-center text-muted fst-italic">No hay procesos en esta categoría.</div>;
    } else if (fetched && processes.length > 0) {
        content = (
            <div
                className="mb-3 process-items-container"
                style={{ maxHeight: '300px', overflowY: 'auto' }}
            >
                {processes.map(process => (
                    <div
                        key={process.id}
                        className="py-3 px-2 d-flex justify-content-between align-items-center border-bottom process-item"
                    >
                        <span className="text-dark fs-5 me-3">{process.name}</span>
                        <div className="btn-group" role="group" aria-label={`Actions for ${process.name}`}>
                            <button
                                type="button"
                                className="btn btn-info"
                                onClick={(e) => handleInfoClick(process.id, process.name, e)}
                                title="Ver Información"
                                style={{ padding: '.375rem .75rem' }}
                            >
                                <i className="bi bi-info-circle fs-5"></i>
                            </button>
                            <button
                                type="button"
                                className="btn btn-warning"
                                onClick={(e) => handleDeleteClick(process.id, process.name, e)}
                                title="Eliminar Proceso"
                                style={{ padding: '.375rem .75rem' }}
                            >
                                <i className="bi bi-trash fs-5"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    } else {
        content = <div className="p-3 text-center text-muted fst-italic">Expanda para ver los procesos.</div>;
    }

    const showCreateButton = fetched || !isLoading;

    return (
        <div className="processes-list-wrapper py-2">
            {content}
            {showCreateButton && (
                <div className="mt-3 text-end">
                    <Link
                        to={`/crear-proceso/${categoryId}`}
                        className="btn btn-primary"
                    >
                       <i className="bi bi-plus-lg me-2"></i>
                        Agregar Nuevo Proceso
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ProcessList;