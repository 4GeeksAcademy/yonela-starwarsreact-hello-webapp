import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import Planeta1 from '../../img/planeta1.jpg';
import Planeta2 from '../../img/planeta2.jpg';
import Planeta3 from '../../img/planeta3.jpg';
import Planeta4 from '../../img/planeta4.jpg';
import Planeta5 from '../../img/planeta5.jpg';
import Planeta6 from '../../img/planeta6.jpg';
import Planeta7 from '../../img/planeta7.jpg';
import Planeta8 from '../../img/planeta8.jpg';
import Planeta9 from '../../img/planeta9.jpg';
import Planeta10 from '../../img/planeta10.jpg';

const planetImages = {
  Tatooine: Planeta1,
  Alderaan: Planeta2,
  "Yavin IV": Planeta3,
  Hoth: Planeta4,
  Dagobah: Planeta5,
  Bespin: Planeta6,
  Endor: Planeta7,
  Naboo: Planeta8,
  Coruscant: Planeta9,
  Kamino: Planeta10,
};

const Planets = () => {
  const { store, actions } = useContext(Context);
  const [planets, setPlanets] = useState([]);
  const [visiblePlanets, setVisiblePlanets] = useState(4); // Mostrar 4 planetas por defecto (1 fila)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Recuperar los planetas almacenados en localStorage
    const storedPlanets = JSON.parse(localStorage.getItem("planets"));

    if (storedPlanets) {
      setPlanets(storedPlanets);
      setLoading(false);
    } else {
      fetchPlanets(); // Si no hay planetas en localStorage, hacer la llamada a la API
    }
  }, []);

  const fetchPlanets = async () => {
    try {
      const response = await fetch("https://www.swapi.tech/api/planets/");
      if (!response.ok) {
        throw new Error("Failed to fetch planets");
      }
      const data = await response.json();

      if (data.results) {
        const planetsData = await Promise.all(
          data.results.map(async (planet) => {
            const res = await fetch(planet.url);
            const planetData = await res.json();
            const planetInfo = planetData.result.properties;
            return {
              ...planetInfo,
              image: planetImages[planetInfo.name] || "https://via.placeholder.com/400x200", // Añadir la imagen
            };
          })
        );
        setPlanets(planetsData);
        localStorage.setItem("planets", JSON.stringify(planetsData)); // Guardar en localStorage
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleLearnMore = (planet) => {
    actions.setSelectedPlanet(planet); // Enviar el planeta seleccionado al estado global
  };

  const handleAddFavorite = (planet) => {
    const isFavorite = store.favorites.some(fav => fav.name === planet.name);

    if (!isFavorite) {
      actions.addFavorite(planet); // Añadir a favoritos usando la acción del store
    } else {
      actions.removeFavorite(planet.name); // Remover de favoritos si ya existe
    }
  };

  const isFavorite = (planet) => {
    return store.favorites.some(fav => fav.name === planet.name);
  };

  if (loading) {
    return <p>Loading planets...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container">
      <h1 style={{ color: "white" }}>Planetas</h1>
      <div className="row">
        {planets.slice(0, visiblePlanets).map((planet, index) => (
          <div key={index} className="col-md-3 mb-4">
            <div className="card">
              <img
                src={planet.image}
                alt={planet.name}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{planet.name}</h5>
                <p className="card-text">Population: {planet.population}</p>
                <p className="card-text">Terrain: {planet.terrain}</p>
                <div className="d-flex justify-content-between">
                  <Link
                    to="/information"
                    onClick={() => handleLearnMore(planet)}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <button className="custom-btn-circle custom-btn-purple">
                      <i className="fas fa-eye"></i>
                    </button>
                  </Link>
                  <button
                    className="custom-btn-circle custom-btn-black"
                    onClick={() => handleAddFavorite(planet)}
                  >
                    <i
                      className={`fas fa-star ${isFavorite(planet) ? 'text-warning' : ''}`} // Aplica text-warning cuando sea favorito
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        {visiblePlanets === 4 && planets.length > 4 && (
          <button className="custom-btn" onClick={() => setVisiblePlanets(planets.length)}>
            Ver más
          </button>
        )}
        {visiblePlanets > 4 && (
          <button className="custom-btn" onClick={() => setVisiblePlanets(4)} style={{ marginLeft: "10px" }}>
            Ver menos
          </button>
        )}
      </div>
    </div>
  );
};

export default Planets;
