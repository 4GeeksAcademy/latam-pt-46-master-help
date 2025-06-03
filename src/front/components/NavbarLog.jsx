import React, { useState, useEffect, useCallback, useRef } from "react";
import logo from "../assets/img/master-help-logo-hz.webp";
import { Link, useNavigate } from "react-router-dom";
import "/workspaces/latam-pt-46-master-help/src/front/index.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Navbar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false); // New state
  const navigate = useNavigate();
  const debounceTimeoutRef = useRef(null);

  const fetchAutocompleteSuggestionsInternal = useCallback(async (searchValue) => {
    // This check is still good for robustness, though useEffect should ensure length >= 3
    if (!searchValue || searchValue.trim().length < 3) {
      setSuggestions([]);
      setIsLoadingSuggestions(false); // Ensure loading is false if we bail early
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found for autocomplete search.");
      setSuggestions([]);
      setIsLoadingSuggestions(false); // Ensure loading is false
      return;
    }

    // Note: setIsLoadingSuggestions(true) is now handled by the useEffect before debounce
    try {
      const response = await fetch(`${BACKEND_URL}/autocomplete?query=${encodeURIComponent(searchValue)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
        console.error("Error fetching autocomplete suggestions:", response.status, errorData.message || response.statusText);
        setSuggestions([]);
      } else {
        const data = await response.json();
        console.log("Autocomplete suggestions received:", data);
        setSuggestions(data.suggestions || data || []);
      }
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false); // Crucial: set loading to false after attempt
    }
  }, [setSuggestions, setIsLoadingSuggestions]); // Added setIsLoadingSuggestions

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearchInputChange = (event) => {
    setSearchBarValue(event.target.value);
  };

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (searchBarValue.trim().length >= 3) {
      setIsLoadingSuggestions(true); // Show loading indicator immediately
      debounceTimeoutRef.current = setTimeout(() => {
        fetchAutocompleteSuggestionsInternal(searchBarValue);
      }, 500);
    } else {
      setSuggestions([]);
      setIsLoadingSuggestions(false); // Clear loading if search term is too short
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchBarValue, fetchAutocompleteSuggestionsInternal, setSuggestions, setIsLoadingSuggestions]);


  const handleSuggestionClick = (suggestion) => {
    if (suggestion && suggestion.id) {
      navigate(`/process/${suggestion.id}`);
    } else {
      console.warn("Clicked suggestion is missing an ID:", suggestion);
    }
    setSearchBarValue(suggestion.name || "");
    setSuggestions([]);
    setIsLoadingSuggestions(false); // Clear loading state
    setIsFocused(false);
  };

  // Common style for dropdown messages
  const dropdownMessageStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 1000,
    border: "1px solid #ced4da",
    borderTopWidth: 0,
    backgroundColor: "white",
    padding: "0.5rem 0.75rem",
    color: "#6c757d",
    textAlign: "left"
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar custom-toggler">
      <div className="container">
        <a className="navbar-brand" href="/#hero">
          <img src={logo} alt="Master Help Logo" height="100" />
        </a>

        <div className="d-flex align-items-center ms-auto">
          <div className="search-container me-2" style={{ position: "relative" }}>
            <input
              type="text"
              className="form-control search-input"
              onChange={handleSearchInputChange}
              value={searchBarValue}
              placeholder={isFocused || searchBarValue ? "" : "      Buscar..."}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsFocused(false);
                  // Don't clear suggestions or loading state here directly on blur,
                  // let handleSuggestionClick or next focus/typing handle it.
                }, 150);
              }}
              style={{ width: "200px" }}
              aria-autocomplete="list"
              aria-controls="autocomplete-suggestions"
            />
            {!(isFocused || searchBarValue) && <i className="fas fa-search search-icon"></i>}

            {/* Loading Message */}
            {isFocused && searchBarValue.length >= 3 && isLoadingSuggestions && (
              <div style={dropdownMessageStyle}>
                Buscando...
              </div>
            )}

            {/* Suggestions List - only show if NOT loading and suggestions exist */}
            {isFocused && !isLoadingSuggestions && suggestions && suggestions.length > 0 && (
              <ul
                id="autocomplete-suggestions"
                className="list-group"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #ced4da",
                  borderTopWidth: 0,
                  backgroundColor: "white"
                }}
              >
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseDown={(e) => e.preventDefault()}
                    style={{ cursor: "pointer", textAlign: "left" }}
                  >
                    {suggestion.name || 'Unnamed Process'}
                  </li>
                ))}
              </ul>
            )}

            {/* No Suggestions Found Message - only show if NOT loading AND no suggestions and tried searching */}
            {isFocused && searchBarValue.length >= 3 && !isLoadingSuggestions && suggestions.length === 0 && (
              <div style={dropdownMessageStyle}>
                No se encontraron sugerencias.
              </div>
            )}
          </div>

          <Link
            to="/dashboard"
            className="btn btn-info me-4"
            style={{
              padding: "6px 20px",
              fontSize: "14px",
              whiteSpace: "nowrap",
            }}
          >
            Mis Procesos
          </Link>

          <button
            onClick={handleLogout}
            className="btn btn-outline-light ms-4"
            style={{ padding: "4px 10px", fontSize: "14px", whiteSpace: "nowrap" }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;