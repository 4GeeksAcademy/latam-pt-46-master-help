import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GenericCreateModal from "../components/ModalCreateElement";
import CategoryList from "../components/CategoryList";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const HomeDashboard = () => {
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [currentToken, setCurrentToken] = useState(localStorage.getItem("token"));
    const [processesData, setProcessesData] = useState({});
    const [expandedCategories, setExpandedCategories] = useState(new Set());

    const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleAuthError = useCallback(() => {
        localStorage.removeItem("token");
        setCurrentToken(null);
        setProcessesData({});
        setExpandedCategories(new Set());
        setIsCreateCategoryModalOpen(false);
        navigate("/login");
    }, [navigate]);

    const fetchCategories = useCallback(async (token) => {
        if (!token) {
            handleAuthError();
            return [];
        }
        try {
            const res = await fetch(`${BACKEND_URL}/categories`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) handleAuthError();
                console.error("Error fetching categories", res.status);
                return [];
            }
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error("Network error fetching categories:", err);
            return [];
        }
    }, [handleAuthError, BACKEND_URL]);

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");
        if (!tokenFromStorage) { navigate("/login"); return; }
        if (currentToken !== tokenFromStorage) setCurrentToken(tokenFromStorage);

        setIsLoadingCategories(true);
        fetchCategories(tokenFromStorage)
            .then(setCategories)
            .catch(error => {
                console.error("Error in promise chain for fetching categories:", error);
                setCategories([]);
            })
            .finally(() => setIsLoadingCategories(false));
    }, [navigate, fetchCategories, currentToken]);

    const baseLoadProcessesForCategory = async (categoryId) => {
        const currentCategoryProcessInfo = processesData[categoryId];
        if (currentCategoryProcessInfo?.isLoading || (currentCategoryProcessInfo?.fetched && !currentCategoryProcessInfo?.error)) {
            return;
        }
        setProcessesData(prev => ({ ...prev, [categoryId]: { processes: [], isLoading: true, error: null, fetched: false } }));
        const tokenToUse = currentToken || localStorage.getItem("token");
        if (!tokenToUse) {
            handleAuthError();
            setProcessesData(prev => ({ ...prev, [categoryId]: { processes: [], isLoading: false, error: "Authentication required.", fetched: true } }));
            return;
        }
        try {
            const res = await fetch(`${BACKEND_URL}/categories/${categoryId}/processes`, { headers: { Authorization: `Bearer ${tokenToUse}` } });
            if (!res.ok) {
                let errorMsg = `Failed to fetch processes. Status: ${res.status || 'Unknown'}`;
                try { const errorData = await res.json(); if (errorData && errorData.error) errorMsg = errorData.error; } catch (e) { /* Ignore */ }
                if (res.status === 401 || res.status === 403) handleAuthError();
                throw new Error(errorMsg);
            }
            const fetchedProcesses = await res.json();
            setProcessesData(prev => ({ ...prev, [categoryId]: { processes: Array.isArray(fetchedProcesses) ? fetchedProcesses : [], isLoading: false, error: null, fetched: true } }));
        } catch (err) {
            console.error(`Error fetching processes for category ${categoryId}:`, err);
            setProcessesData(prev => ({ ...prev, [categoryId]: { processes: [], isLoading: false, error: err.message || "Failed to load processes.", fetched: true } }));
        }
    };
    const loadProcessesForCategory = useCallback(baseLoadProcessesForCategory, [processesData, currentToken, handleAuthError, BACKEND_URL]);


    const handleOpenCreateCategoryModal = () => {
        if (!(currentToken || localStorage.getItem("token"))) { handleAuthError(); return; }
        setIsCreateCategoryModalOpen(true);
    };
    const handleCloseCreateCategoryModal = () => setIsCreateCategoryModalOpen(false);
    const handleCategoryCreated = (newCategory) => {
        setCategories(prev => [...prev, newCategory]);
    };

    const baseToggleCategoryExpansion = (categoryId) => {
        setExpandedCategories(prevExpanded => {
            const newExpanded = new Set(prevExpanded);
            if (newExpanded.has(categoryId)) {
                newExpanded.delete(categoryId);
            } else {
                newExpanded.add(categoryId);
                const categoryProcessInfo = processesData[categoryId];
                if (!categoryProcessInfo || !categoryProcessInfo.fetched || categoryProcessInfo.error) {
                    loadProcessesForCategory(categoryId);
                }
            }
            return newExpanded;
        });
    };
    const toggleCategoryExpansion = useCallback(baseToggleCategoryExpansion, [processesData, loadProcessesForCategory]);

    const baseHandleDeleteCategory = async (categoryId) => {
        const token = currentToken || localStorage.getItem("token");
        if (!token) { handleAuthError(); return; }
        if (!window.confirm("¿Seguro que deseas eliminar esta categoría y todos sus procesos?")) return;
        try {
            const res = await fetch(`${BACKEND_URL}/categories/${categoryId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) {
                let errorMessage = "No se pudo eliminar la categoría.";
                try {
                    const errorData = await res.json();
                    if (errorData && errorData.error) errorMessage = errorData.error;
                } catch (e) { /* ignore */ }
                alert(errorMessage);
                if (res.status === 401 || res.status === 403) handleAuthError();
                return;
            }
            const successData = await res.json().catch(() => ({ message: "Categoría eliminada exitosamente." }));
            alert(successData.message || "Categoría eliminada exitosamente.");
            setCategories(prev => prev.filter(cat => cat.id !== categoryId));
            setProcessesData(prev => { const newData = { ...prev }; delete newData[categoryId]; return newData; });
            setExpandedCategories(prev => { const newExpanded = new Set(prev); newExpanded.delete(categoryId); return newExpanded; });
        } catch (err) {
            console.error("Network error deleting category:", err);
            alert("Error de conexión al intentar eliminar la categoría.");
        }
    };
    const handleDeleteCategory = useCallback(baseHandleDeleteCategory, [currentToken, handleAuthError, BACKEND_URL]);


    if (isLoadingCategories && categories.length === 0) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div>
                <p className="mt-2">Cargando categorías...</p>
            </div>
        );
    }

    return (
        <>
            <div className="container mt-5 py-4">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <h2 className="m-0">Panel de Inicio</h2>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                    <h3 className="m-0 text-secondary">Mis Categorías</h3>
                    <button className="btn btn-outline-light" onClick={handleOpenCreateCategoryModal}>
                        <i className=" bi bi-plus-lg me-1"></i> Crear Categoría
                    </button>
                </div>

                {!isLoadingCategories && categories.length === 0 ? (
                    <div className="alert alert-info p-4 text-center" role="alert">
                        No hay categorías creadas aún. ¡Crea tu primera categoría!
                    </div>
                ) : (
                    <CategoryList
                        categories={categories}
                        expandedCategories={expandedCategories}
                        processesData={processesData}
                        onToggleExpansion={toggleCategoryExpansion}
                        onDeleteCategory={handleDeleteCategory}
                    />
                )}
            </div>

            {currentToken && (
                <GenericCreateModal
                    isOpen={isCreateCategoryModalOpen}
                    onClose={handleCloseCreateCategoryModal}
                    onItemCreated={handleCategoryCreated}
                    token={currentToken}
                    submitUrl={`${BACKEND_URL}/categories`}
                    itemTypeLabel="Categoría"
                    itemNameInputLabel="Nombre de la Categoría"
                    modalTitleText="Crear Nueva Categoría"
                    submitButtonTextDefault="Guardar Categoría"
                    submitButtonTextLoading="Guardando..."
                    inputId="createCategoryNameInput"
                />
            )}
        </>
    );
};

export default HomeDashboard;