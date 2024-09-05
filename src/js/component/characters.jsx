import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Character1 from '../../img/pj1.jpg';
import Character2 from '../../img/pj2.jpg';
import Character3 from '../../img/pj3.jpg';
import Character4 from '../../img/pj4.jpg';
import Character5 from '../../img/pj5.jpg';
import Character6 from '../../img/pj6.jpg';
import Character7 from '../../img/pj7.jpg';
import Character8 from '../../img/pj8.jpg';
import Character9 from '../../img/pj9.jpg';
import Character10 from '../../img/pj10.jpg';

const characterImages = {
    "luke skywalker": Character1,
    "c-3po": Character2,
    "r2-d2": Character3,
    "darth vader": Character4,
    "leia organa": Character5,
    "owen lars": Character6,
    "beru whitesun lars": Character7,
    "r5-d4": Character8,
    "biggs darklighter": Character9,
    "obi-wan kenobi": Character10,
};

const normalizeName = (name) => {
    return name.toLowerCase().replace(/\s+/g, ' ').trim();
};

const Characters = () => {
    const { actions, store } = useContext(Context);
    const navigate = useNavigate();
    const [characters, setCharacters] = useState([]);
    const [visibleCharacters, setVisibleCharacters] = useState(4);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const saveToLocalStorage = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    const getFromLocalStorage = (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    };

    const fetchCharacterDetails = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch character details");
            }
            const data = await response.json();
            return data.result.properties;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const fetchCharacters = async () => {
        try {
            const response = await fetch("https://www.swapi.tech/api/people/");
            if (!response.ok) {
                throw new Error("Failed to fetch characters");
            }
            const data = await response.json();
            const characterDetailsPromises = data.results.map((character) =>
                fetchCharacterDetails(character.url)
            );
            const detailedCharacters = await Promise.all(characterDetailsPromises);

            const charactersWithImages = detailedCharacters.map((character) => {
                const normalizedName = normalizeName(character.name);
                return {
                    ...character,
                    image: characterImages[normalizedName] || "https://via.placeholder.com/400x200"
                };
            });

            setCharacters(charactersWithImages);
            saveToLocalStorage("characters", charactersWithImages);

            actions.setCharacters(charactersWithImages);

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedCharacters = getFromLocalStorage("characters");
        if (storedCharacters) {
            setCharacters(storedCharacters);
            setLoading(false);
        } else {
            fetchCharacters();
        }
    }, []);

    const handleShowMore = () => {
        setVisibleCharacters(characters.length);
    };

    const handleShowLess = () => {
        setVisibleCharacters(4);
    };

    const handleLearnMore = (character) => {
        actions.setSelectedCharacter(character);
        navigate("/information");
    };

    const handleAddToFavorites = (character) => {
        const isFavorite = store.favorites.some(fav => fav.name === character.name);
        if (isFavorite) {
            actions.removeFavorite(character.name);
        } else {
            actions.addFavorite(character);
        }
    };

    const isFavorite = (name) => {
        return store.favorites.some(fav => fav.name === name);
    };

    if (loading) {
        return <p>Loading characters...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container">
            <h1 style={{ color: "white" }}>Personajes</h1>
            <div className="row">
                {characters.slice(0, visibleCharacters).map((character, index) => (
                    <div key={index} className="col-md-3 mb-4">
                        <div className="card">
                            <img
                                src={character.image}
                                alt={character.name}
                                className="card-img-top"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{character.name}</h5>
                                <p className="card-text">
                                    Gender: {character.gender}
                                </p>
                                <p className="card-text">
                                    Birth Year: {character.birth_year}
                                </p>
                                <p className="card-text">
                                    Height: {character.height} cm
                                </p>
                                <p className="card-text">
                                    Mass: {character.mass} kg
                                </p>
                                <div className="d-flex justify-content-between">
                                    <button
                                        className="custom-btn-circle custom-btn-purple"
                                        onClick={() => handleLearnMore(character)}
                                    >
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button
                                        className="custom-btn-circle custom-btn-black"
                                        onClick={() => handleAddToFavorites(character)}
                                    >
                                        <i className={`fas fa-star ${isFavorite(character.name) ? 'text-warning' : ''}`}></i> {/* Solo el icono cambia de color */}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center">
                {visibleCharacters === 4 && characters.length > 4 && (
                    <button className="custom-btn" onClick={handleShowMore}>
                        Ver más
                    </button>
                )}
                {visibleCharacters > 4 && (
                    <button className="custom-btn" onClick={handleShowLess} style={{ marginLeft: "10px" }}>
                        Ver menos
                    </button>
                )}
            </div>
        </div>
    );
};

export default Characters;
