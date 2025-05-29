import React from 'react';
import ProcessList from './ProcessList';

const CategoryItem = ({
    category,
    isExpanded,
    processesDataForCategory,
    onToggleExpansion,
    onDeleteCategory,
}) => {
    const { processes = [], isLoading = false, error = null, fetched = false } = processesDataForCategory || {};

    return (
        <div className="list-group-item mb-3 p-0 shadow-sm rounded border">
            <div
                className="d-flex justify-content-between align-items-center px-3 py-3"
                style={{ cursor: 'pointer' }}
                onClick={() => onToggleExpansion(category.id)}
                aria-expanded={isExpanded}
                aria-controls={`collapse-processes-${category.id}`}
            >
                <div className="d-flex align-items-center">
                    <span className="me-3 fs-5 fw-bold text-primary">
                        {isExpanded ? '▼' : '▶'}
                    </span>
                    <strong className="fs-5">{category.name}</strong>
                </div>
                <button
                    className="btn btn-outline-danger btn-sm py-1 px-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCategory(category.id);
                    }}
                >
                    <i className="bi bi-trash me-1"></i>
                    Eliminar
                </button>
            </div>
            {isExpanded && (
                <div id={`collapse-processes-${category.id}`} className="border-top px-3 pb-2 bg-light">
                    <ProcessList
                        categoryId={category.id}
                        processes={processes}
                        isLoading={isLoading}
                        error={error}
                        fetched={fetched}
                    />
                </div>
            )}
        </div>
    );
};

export default CategoryItem;