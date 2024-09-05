import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import SearchBar from "./searchbar.jsx";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false); // Estado para mostrar o esconder los favoritos
  const navbarRef = useRef(null); // Referencia para calcular la altura del navbar
  const favoritesRef = useRef(null); // Referencia para el botón de favoritos
  const dropdownRef = useRef(null); // Referencia para el menú desplegable de favoritos
  const { store, actions } = useContext(Context); // Recuperamos el contexto global para manejar los favoritos

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateNavbarHeight);

    updateNavbarHeight(); // Calcular la altura del navbar al cargar

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verifica si el clic fue fuera del botón de favoritos y fuera del menú desplegable
      if (
        favoritesRef.current &&
        !favoritesRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowFavorites(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Función para alternar la visualización del menú de favoritos
  const handleToggleFavorites = () => {
    setShowFavorites((prev) => !prev);
  };

  // Función para remover un favorito
  const handleRemoveFavorite = (name) => {
    actions.removeFavorite(name); // Remover favorito usando la acción global
  };

  return (
    <>
      {/* Navbar con clase dinámica para cambiar entre inicial y fija */}
      <nav
        ref={navbarRef}
        className={`navbar navbar-dark ${isScrolled ? "navbar-fixed" : "navbar-initial"} navbar-transition`}
      >
        <Link to="/" className="navbar-brand" style={{ color: 'white', paddingLeft: '20px' }}>
          StarWars
        </Link>
        <div className="d-flex align-items-center justify-content-end" style={{ paddingRight: '40px' }}>
          <SearchBar />
        </div>
        <div className="d-flex align-items-center justify-content-end" style={{ paddingRight: '40px' }}>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item position-relative" style={{ cursor: 'pointer', color: 'white' }}>
              <div
                ref={favoritesRef}
                onClick={handleToggleFavorites}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <i className="fas fa-star mr-2" style={{ color: 'white' }}></i>
                Favoritos
                {store.favorites.length > 0 && (
                  <span className="badge badge-danger" style={{
                    position: "absolute", top: "-5px", right: "-15px", backgroundColor: "red",
                    color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "10px", minWidth: "18px",
                    height: "18px", display: "flex", justifyContent: "center", alignItems: "center", lineHeight: "1"
                  }}>
                    {store.favorites.length}
                  </span>
                )}
              </div>

              {/* Menú desplegable de favoritos */}
              {showFavorites && (
                <div
                  ref={dropdownRef}
                  className="dropdown-menu p-2 show"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: "0",
                    transform: "translateX(-20%)",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    minWidth: "200px",
                    zIndex: 1000
                  }}
                >
                  {store.favorites.length === 0 ? (
                    <p className="mb-0">No hay favoritos</p>
                  ) : (
                    store.favorites.map((fav, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                        <p className="mb-0">{fav.name}</p>
                        <i className="fas fa-trash-alt ml-2" style={{ cursor: "pointer" }}
                          onClick={() => handleRemoveFavorite(fav.name)}></i>
                      </div>
                    ))
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>

    </>
  );
};
