import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CreateCategoryButton from "../components/CreateCategoryButton";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const HomeDashboard = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentToken, setCurrentToken] = useState(localStorage.getItem("token"));

    const navigate = useNavigate();

    const handleAuthError = useCallback(() => {
        localStorage.removeItem("token");
        setCurrentToken(null);
        navigate("/login");
    }, [navigate]);

    const fetchCategories = useCallback(async (token) => {
        if (!token) return [];
        try {
            const res = await fetch(`${BACKEND_URL}/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                console.error("Error al obtener categorías. Status:", res.status);
                if (res.status === 401 || res.status === 403) {
                    handleAuthError();
                }
                return [];
            }

            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Error de conexión al obtener categorías:", err);
            return [];
        }
    }, [handleAuthError]);

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");
        if (!tokenFromStorage) {
            console.log("No token found, redirecting to login.");
            navigate("/login"); // This should cause unmount, so further execution is less critical
            return;
        }
        // If currentToken state is different from storage (e.g. after login), update it.
        if (currentToken !== tokenFromStorage) {
            setCurrentToken(tokenFromStorage);
        }


        setIsLoading(true);
        Promise.all([
            fetchCategories(tokenFromStorage)
        ])
            .then(([categoriesData]) => {
                // Ensure categoriesData is an array, even if API call failed and returned empty array
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            })
            .catch(error => {
                console.error("Error fetching initial data:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });

    }, [navigate, fetchCategories, currentToken]); // Add currentToken as dep if you want to re-fetch if it changes externally

    const handleDeleteCategory = async (categoryId) => {
        const token = localStorage.getItem("token"); // Always get the freshest token
        if (!token) {
            alert("Sesión expirada. Por favor, inicie sesión de nuevo.");
            handleAuthError();
            return;
        }

        const confirmDelete = window.confirm(
            "¿Seguro que deseas eliminar esta categoría?"
        );
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${BACKEND_URL}/categories/${categoryId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                let errorMessage = "No se pudo eliminar la categoría.";
                try {
                    const errorData = await res.json();
                    if (errorData && errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (e) {
                    console.warn("Could not parse JSON error response for delete category:", e);
                    try {
                        const errorText = await res.text();
                        if (errorText) errorMessage = errorText;
                    } catch (textError) {
                        console.warn("Could not parse text error response for delete category:", textError);
                    }
                }
                console.error("Error al eliminar categoría:", res.status, errorMessage);
                alert(errorMessage);
                if (res.status === 401 || res.status === 403) {
                    handleAuthError();
                }
                return;
            }

            const successData = await res.json();
            alert(successData.message || "Categoría eliminada exitosamente.");

            setCategories(prevCategories => prevCategories.filter((cat) => cat.id !== categoryId));
        } catch (err) {
            console.error("Error de red al eliminar categoría:", err);
            alert("Error de conexión al intentar eliminar la categoría.");
        }
    };


    const handleOpenCreateModal = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Sesión expirada. Por favor, inicie sesión de nuevo.");
            handleAuthError();
            return;
        }
        setCurrentToken(token);
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleCategoryCreated = (newCategory) => {
        setCategories(prevCategories => [...prevCategories, newCategory]);

    };

    return (
        <>
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="m-0">Panel de Inicio</h2>
                </div>


                <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
                    <h3 className="m-0">Mis Categorías</h3>
                    <button
                        className="btn btn-success"
                        onClick={handleOpenCreateModal} // Updated onClick
                    >
                        + Crear Categoría
                    </button>
                </div>

                {categories.length === 0 && !isLoading ? ( // Also check !isLoading here
                    <div className="alert alert-secondary" role="alert">
                        No hay categorías creadas aún. ¡Crea tu primera categoría!
                    </div>
                ) : (
                    <ul className="list-group">
                        {categories.map((category) => (
                            <li
                                key={category.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <strong>{category.name}</strong>
                                    {/* You might want to display category.description or other fields here */}
                                </div>
                                <div>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => handleDeleteCategory(category.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {currentToken && ( // Only render modal if a token exists
                <CreateCategoryButton
                    isOpen={isCreateModalOpen}
                    onClose={handleCloseCreateModal}
                    onCategoryCreated={handleCategoryCreated}
                    backendUrl={BACKEND_URL}
                    token={currentToken} // Pass the current token
                />
            )}
        </>
    );
};

export default HomeDashboard;