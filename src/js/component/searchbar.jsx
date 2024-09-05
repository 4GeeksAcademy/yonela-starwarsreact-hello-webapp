import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const { actions } = useContext(Context);
    const [searchTerm, setSearchTerm] = useState("");
    const [characters, setCharacters] = useState([]);
    const [planets, setPlanets] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const navigate = useNavigate();

    // Función para buscar personajes
    const fetchCharacters = async () => {
        const response = await fetch("https://www.swapi.tech/api/people");
        const data = await response.json();
        setCharacters(data.results);
        localStorage.setItem("characters", JSON.stringify(data.results)); // Guardar personajes en localStorage
    };

    // Función para buscar planetas
    const fetchPlanets = async () => {
        const response = await fetch("https://www.swapi.tech/api/planets");
        const data = await response.json();
        setPlanets(data.results);
        localStorage.setItem("planets", JSON.stringify(data.results)); // Guardar planetas en localStorage
    };

    // Función para buscar vehículos
    const fetchVehicles = async () => {
        const response = await fetch("https://www.swapi.tech/api/vehicles");
        const data = await response.json();
        setVehicles(data.results);
        localStorage.setItem("vehicles", JSON.stringify(data.results)); // Guardar vehículos en localStorage
    };

    // Llama a las APIs una vez al cargar el componente
    useEffect(() => {
        // Si ya existen datos en localStorage, cargarlos desde allí
        const storedCharacters = JSON.parse(localStorage.getItem("characters"));
        const storedPlanets = JSON.parse(localStorage.getItem("planets"));
        const storedVehicles = JSON.parse(localStorage.getItem("vehicles"));

        if (storedCharacters) setCharacters(storedCharacters);
        else fetchCharacters(); // Si no existen personajes, hacer la llamada a la API

        if (storedPlanets) setPlanets(storedPlanets);
        else fetchPlanets(); // Si no existen planetas, hacer la llamada a la API

        if (storedVehicles) setVehicles(storedVehicles);
        else fetchVehicles(); // Si no existen vehículos, hacer la llamada a la API
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term.length === 0) {
            setFilteredItems([]); // Vaciar la lista si no hay búsqueda
            return;
        }

        // Filtros para personajes, planetas y vehículos
        const characterMatches = characters.filter((item) =>
            item.name.toLowerCase().includes(term)
        );
        const planetMatches = planets.filter((item) =>
            item.name.toLowerCase().includes(term)
        );
        const vehicleMatches = vehicles.filter((item) =>
            item.name.toLowerCase().includes(term)
        );

        // Combinar los resultados
        setFilteredItems([...characterMatches, ...planetMatches, ...vehicleMatches]);
    };

    // Función para obtener los datos del `localStorage`
    const getItemFromLocalStorage = (item, type) => {
        let storedData = JSON.parse(localStorage.getItem(type));
        return storedData.find(dataItem => dataItem.name === item.name);
    };

    const handleSelectItem = (item) => {
        // Obtener los datos del localStorage
        let itemDetails = null;

        if (characters.some(character => character.name === item.name)) {
            itemDetails = getItemFromLocalStorage(item, "characters");
            actions.setSelectedCharacter(itemDetails);
        } else if (planets.some(planet => planet.name === item.name)) {
            itemDetails = getItemFromLocalStorage(item, "planets");
            actions.setSelectedPlanet(itemDetails);
        } else if (vehicles.some(vehicle => vehicle.name === item.name)) {
            itemDetails = getItemFromLocalStorage(item, "vehicles");
            actions.setSelectedVehicle(itemDetails);
        }

        navigate("/information"); // Redirigir a la página de información
        setSearchTerm(""); // Limpiar el campo de búsqueda
        setFilteredItems([]); // Limpiar la lista de autocompletado
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && filteredItems.length > 0) {
            handleSelectItem(filteredItems[0]); // Seleccionar el primer elemento filtrado
        }
    };

    return (
        <div className="search-bar" style={{ position: "relative", width: "100%" }}>
            <input
                type="text"
                className="form-control search-input"
                placeholder="Buscador..."
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={handleKeyPress}
                style={inputStyle} // Estilos personalizados para el input
            />

            {/* Lista de autocompletado */}
            {filteredItems.length > 0 && (
                <ul className="list-group mt-2 autocomplete-list" style={listStyle}>
                    {filteredItems.map((item, index) => (
                        <li
                            key={index}
                            className="list-group-item autocomplete-item"
                            onClick={() => handleSelectItem(item)}
                            style={itemStyle}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// Estilos personalizados para el input
const inputStyle = {
    padding: "12px 20px",
    borderRadius: "30px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "16px",
    transition: "box-shadow 0.2s ease",
    width: "100%",
};

const listStyle = {
    position: "absolute",
    zIndex: 1000,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxHeight: "200px",
    overflowY: "auto",
};

const itemStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
};

// Añadir efectos hover a los elementos
const hoverStyle = {
    backgroundColor: "#f0f0f0"
};

export default SearchBar;
