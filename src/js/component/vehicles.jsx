import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import Vehiculo1 from '../../img/vehiculo1.jpg';
import Vehiculo2 from '../../img/vehiculo2.jpg';
import Vehiculo3 from '../../img/vehiculo3.jpg';
import Vehiculo4 from '../../img/vehiculo4.jpg';
import Vehiculo5 from '../../img/vehiculo5.jpg';
import Vehiculo6 from '../../img/vehiculo6.jpg';
import Vehiculo7 from '../../img/vehiculo7.jpg';
import Vehiculo8 from '../../img/vehiculo8.jpg';
import Vehiculo9 from '../../img/vehiculo9.jpg';
import Vehiculo10 from '../../img/vehiculo10.jpg';

// Mapeamos los nombres de los vehículos con imágenes
const vehicleImages = {
    "Sand Crawler": Vehiculo1,
    "X-34 landspeeder": Vehiculo2,
    "T-16 skyhopper": Vehiculo3,
    "TIE/LN starfighter": Vehiculo4,
    "Snowspeeder": Vehiculo5,
    "TIE bomber": Vehiculo6,
    "AT-AT": Vehiculo7,
    "AT-ST": Vehiculo8,
    "Storm IV Twin-Pod cloud car": Vehiculo9,
    "Sail barge": Vehiculo10,
};

const Vehicles = () => {
    const { store, actions } = useContext(Context);
    const [vehicles, setVehicles] = useState([]);
    const [visibleVehicles, setVisibleVehicles] = useState(4); // Mostrar 4 vehículos por defecto
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Recuperar los vehículos almacenados en localStorage
        const storedVehicles = JSON.parse(localStorage.getItem("vehicles"));

        if (storedVehicles) {
            setVehicles(storedVehicles);
            setLoading(false);
        } else {
            fetchVehicles(); // Si no hay vehículos en localStorage, hacer la llamada a la API
        }
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await fetch("https://www.swapi.tech/api/vehicles/");
            if (!response.ok) {
                throw new Error("Failed to fetch vehicles");
            }
            const data = await response.json();

            if (data.results) {
                const vehiclesData = await Promise.all(
                    data.results.map(async (vehicle) => {
                        const res = await fetch(vehicle.url);
                        const vehicleData = await res.json();
                        const vehicleInfo = vehicleData.result.properties;

                        console.log("Nombre del vehículo desde API:", vehicleInfo.name);

                        return {
                            ...vehicleInfo,
                            image: vehicleImages[vehicleInfo.name] || "https://via.placeholder.com/400x200", // Asignar la imagen
                        };
                    })
                );
                setVehicles(vehiclesData);
                localStorage.setItem("vehicles", JSON.stringify(vehiclesData)); // Guardar en localStorage
            }

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleLearnMore = (vehicle) => {
        actions.setSelectedVehicle(vehicle); // Enviar el vehículo seleccionado al estado global
    };

    // Nuevo método: añadir o eliminar favorito
    const handleToggleFavorite = (vehicle) => {
        const isFavorite = store.favorites.some(fav => fav.name === vehicle.name);

        if (isFavorite) {
            actions.removeFavorite(vehicle.name); // Si ya está en favoritos, eliminarlo
        } else {
            actions.addFavorite(vehicle); // Si no está, añadirlo
        }
    };

    if (loading) {
        return <p>Loading vehicles...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container">
            <h1 style={{ color: "white" }}>Vehículos</h1>
            <div className="row">
                {vehicles.slice(0, visibleVehicles).map((vehicle, index) => (
                    <div key={index} className="col-md-3 mb-4">
                        <div className="card">
                            <img
                                src={vehicle.image}
                                alt={vehicle.name}
                                className="card-img-top"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{vehicle.name}</h5>
                                <p className="card-text">Model: {vehicle.model}</p>
                                <p className="card-text">Manufacturer: {vehicle.manufacturer}</p>
                                <div className="d-flex justify-content-between">
                                    <Link
                                        to="/information"
                                        onClick={() => handleLearnMore(vehicle)}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <button className="custom-btn-circle custom-btn-purple">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                    </Link>
                                    <button
                                        className="custom-btn-circle custom-btn-black"
                                        onClick={() => handleToggleFavorite(vehicle)}
                                    >
                                        <i className={`fas fa-star ${store.favorites.some(fav => fav.name === vehicle.name) ? 'text-warning' : ''}`}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Botones de ver más y ver menos */}
            <div className="text-center">
                {visibleVehicles === 4 && vehicles.length > 4 && (
                    <button className="custom-btn" onClick={() => setVisibleVehicles(vehicles.length)}>
                        Ver más
                    </button>
                )}
                {visibleVehicles > 4 && (
                    <button className="custom-btn" onClick={() => setVisibleVehicles(4)} style={{ marginLeft: "10px" }}>
                        Ver menos
                    </button>
                )}
            </div>
        </div>
    );
};

export default Vehicles;
