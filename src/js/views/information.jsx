import React, { useContext } from "react";
import { Context } from "../store/appContext";
import Star from "../animation/start.jsx"

const Information = () => {
  const { store } = useContext(Context);
  const character = store.selectedCharacter;
  const planet = store.selectedPlanet;
  const vehicle = store.selectedVehicle; // Añadir para manejar vehículos

  if (!character && !planet && !vehicle) {
    return <p style={{ color: "white" }}>No character, planet, or vehicle selected.</p>;
  }

  return (
    <div className="container mt-4">
      <Star />
      <div className="row">
        {/* Imagen alineada a la izquierda */}
        <div className="col-md-4">
          {character && (
            <img
              src={character.image}
              alt={character.name}
              className="img-fluid rounded"
              style={{ width: "100%", height: "auto", maxHeight: "1000px", objectFit: "cover" }} // Imagen más grande
            />
          )}
          {planet && (
            <img
              src={planet.image}
              alt={planet.name}
              className="img-fluid rounded"
              style={{ width: "100%", height: "auto", maxHeight: "1000px", objectFit: "cover" }} // Imagen más grande
            />
          )}
          {vehicle && (
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="img-fluid rounded"
              style={{ width: "100%", height: "auto", maxHeight: "1000px", objectFit: "cover" }} // Imagen más grande
            />
          )}
        </div>

        {/* Información a la derecha */}
        <div className="col-md-8">
          {character && (
            <>
              <h1 style={{ color: "white" }}>{character.name}</h1>
              <p style={{ color: "white" }}><strong>Gender:</strong> {character.gender}</p>
              <p style={{ color: "white" }}><strong>Birth Year:</strong> {character.birth_year}</p>
              <p style={{ color: "white" }}><strong>Height:</strong> {character.height} cm</p>
              <p style={{ color: "white" }}><strong>Mass:</strong> {character.mass} kg</p>
              <p style={{ color: "white" }}><strong>Skin Color:</strong> {character.skin_color}</p>
              <p style={{ color: "white" }}><strong>Eye Color:</strong> {character.eye_color}</p>
              <p style={{ color: "white" }}><strong>Hair Color:</strong> {character.hair_color}</p>
            </>
          )}
          {planet && (
            <>
              <h1 style={{ color: "white" }}>{planet.name}</h1>
              <p style={{ color: "white" }}><strong>Population:</strong> {planet.population}</p>
              <p style={{ color: "white" }}><strong>Climate:</strong> {planet.climate}</p>
              <p style={{ color: "white" }}><strong>Terrain:</strong> {planet.terrain}</p>
              <p style={{ color: "white" }}><strong>Diameter:</strong> {planet.diameter} km</p>
              <p style={{ color: "white" }}><strong>Gravity:</strong> {planet.gravity}</p>
            </>
          )}
          {vehicle && (
            <>
              <h1 style={{ color: "white" }}>{vehicle.name}</h1>
              <p style={{ color: "white" }}><strong>Model:</strong> {vehicle.model}</p>
              <p style={{ color: "white" }}><strong>Manufacturer:</strong> {vehicle.manufacturer}</p>
              <p style={{ color: "white" }}><strong>Cost in Credits:</strong> {vehicle.cost_in_credits}</p>
              <p style={{ color: "white" }}><strong>Length:</strong> {vehicle.length} meters</p>
              <p style={{ color: "white" }}><strong>Max Speed:</strong> {vehicle.max_atmosphering_speed} km/h</p>
              <p style={{ color: "white" }}><strong>Crew:</strong> {vehicle.crew}</p>
              <p style={{ color: "white" }}><strong>Passengers:</strong> {vehicle.passengers}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Information;
