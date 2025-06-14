import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GenericCreateModal from "../components/ModalCreateElement";
import CategoryList from "../components/CategoryList";
import ModalMessage from "../components/ModalMessage";
import introJs from 'intro.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const HomeDashboard = () => {
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [currentToken, setCurrentToken] = useState(localStorage.getItem("token"));
    const [processesData, setProcessesData] = useState({});
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);

    // Modal for confirmation and info
    const [modal, setModal] = useState({
        show: false,
        title: "",
        message: "",
        onConfirm: null,
        onCancel: null,
        confirmText: "Eliminar",
        cancelText: "Cancelar"
    });
    const [infoModal, setInfoModal] = useState({
        show: false,
        title: "",
        message: "",
        onClose: null
    });

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

    // Modal-based delete confirmation
    const baseHandleDeleteCategory = async (categoryId) => {
        const token = currentToken || localStorage.getItem("token");
        if (!token) { handleAuthError(); return; }
        setModal({
            show: true,
            title: "Eliminar Categoría",
            message: "¿Seguro que deseas eliminar esta categoría y todos sus procesos?",
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            onConfirm: () => confirmDeleteCategory(categoryId),
            onCancel: () => setModal(prev => ({ ...prev, show: false }))
        });
    };

    const confirmDeleteCategory = async (categoryId) => {
        setModal(prev => ({ ...prev, show: false }));
        const token = currentToken || localStorage.getItem("token");
        try {
            const res = await fetch(`${BACKEND_URL}/categories/${categoryId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) {
                let errorMessage = "No se pudo eliminar la categoría.";
                try {
                    const errorData = await res.json();
                    if (errorData && errorData.error) errorMessage = errorData.error;
                } catch (e) { /* ignore */ }
                setInfoModal({
                    show: true,
                    title: "Error",
                    message: errorMessage,
                    onClose: () => setInfoModal(prev => ({ ...prev, show: false }))
                });
                if (res.status === 401 || res.status === 403) handleAuthError();
                return;
            }
            const successData = await res.json().catch(() => ({ message: "Categoría eliminada exitosamente." }));
            setInfoModal({
                show: true,
                title: "Eliminada",
                message: successData.message || "Categoría eliminada exitosamente.",
                onClose: () => setInfoModal(prev => ({ ...prev, show: false }))
            });
            setCategories(prev => prev.filter(cat => cat.id !== categoryId));
            setProcessesData(prev => { const newData = { ...prev }; delete newData[categoryId]; return newData; });
            setExpandedCategories(prev => { const newExpanded = new Set(prev); newExpanded.delete(categoryId); return newExpanded; });
        } catch (err) {
            console.error("Network error deleting category:", err);
            setInfoModal({
                show: true,
                title: "Error",
                message: "Error de conexión al intentar eliminar la categoría.",
                onClose: () => setInfoModal(prev => ({ ...prev, show: false }))
            });
        }
    };

    const handleDeleteCategory = useCallback(baseHandleDeleteCategory, [currentToken, handleAuthError, BACKEND_URL]);

    // --- TOUR LOGIC WITH UNIQUE SELECTORS ---
    const startTour = () => {
        introJs()
            .setOptions({
                steps: [
                    {
                        element: '.navbar',
                        intro: 'Esta es la barra de navegación, desde aquí puedes acceder a otras secciones.',
                        position: 'bottom'
                    },
                    {
                        element: '.container.mt-5.py-4',
                        intro: 'Aquí puedes ver y gestionar tus categorías.',
                        position: 'top'
                    },
                    {
                        element: '#tour-create-category',
                        intro: 'Desde aquí puedes crear una nueva categoría.',
                        position: 'left'
                    },
                    {
                        element: '.alert.alert-info',
                        intro: 'Aquí verás un mensaje si no tienes categorías creadas.',
                        position: 'top'
                    },
                    {
                        element: '.tour-category-card',
                        intro: 'Cada tarjeta representa una categoría. Puedes expandirla para ver los procesos dentro de ella.',
                        position: 'top'
                    },
                    {
                        element: '#tour-add-process',
                        intro: 'Crea tu primer proceso aquí.',
                        position: 'left'
                    },
                    // The following step is on another page (CreateProcess), see docs for multi-page tours
                    {
                        element: '#tour-first-step-label',
                        intro: 'Agrega el primer paso de tu proceso aquí.',
                        position: 'right'
                    }
                ],
                tooltipClass: 'customTooltip',
                overlayOpacity: 0.8,
                showBullets: false,
                showProgress: true,
                exitOnOverlayClick: false,
                exitOnEsc: true,
                scrollToElement: true,
            })
            .start();
    };

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
            <div className="container mt-5 py-4">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <h2 className="m-0">Panel de Inicio</h2>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                    <h3 className="m-0 text-secondary">Mis Categorías</h3>
                    <div>
                        <button
                            id="tour-create-category"
                            className="btn btn-outline-light"
                            onClick={handleOpenCreateCategoryModal}
                        >
                            <i className="bi bi-plus-lg me-1"></i> Crear Categoría
                        </button>
                        <button className="btn btn-outline-primary ms-2" onClick={startTour}>
                            Guía interactiva
                        </button>
                    </div>
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