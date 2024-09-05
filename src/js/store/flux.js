const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			favorites: [],
			characters: [], // Lista de personajes
			planets: [], // Lista de planetas
			vehicles: [], // Lista de vehículos
			selectedCharacter: null,
			selectedPlanet: null,
			selectedVehicle: null,
		},
		actions: {
			// Cargar personajes, planetas y vehículos desde la API
			loadInitialData: async () => {
				const characterResponse = await fetch("https://www.swapi.tech/api/people");
				const characterData = await characterResponse.json();
				setStore({ characters: characterData.results });

				const planetResponse = await fetch("https://www.swapi.tech/api/planets");
				const planetData = await planetResponse.json();
				setStore({ planets: planetData.results });

				const vehicleResponse = await fetch("https://www.swapi.tech/api/vehicles");
				const vehicleData = await vehicleResponse.json();
				setStore({ vehicles: vehicleData.results });
			},

			// Set favoritos al cargar la aplicación
			setFavorites: (favorites) => {
				setStore({ favorites: favorites });
			},

			// Agregar un favorito
			addFavorite: (item) => {
				const store = getStore();
				const updatedFavorites = [...store.favorites, item];
				setStore({ favorites: updatedFavorites });

				// Guardar los favoritos en localStorage
				localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
			},

			// Eliminar un favorito
			removeFavorite: (name) => {
				const store = getStore();
				const updatedFavorites = store.favorites.filter(fav => fav.name !== name);
				setStore({ favorites: updatedFavorites });

				// Guardar los favoritos actualizados en localStorage
				localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
			},

			// Guardar el personaje seleccionado
			setSelectedCharacter: (character) => {
				setStore({ selectedCharacter: character, selectedPlanet: null, selectedVehicle: null });
			},

			// Guardar el planeta seleccionado
			setSelectedPlanet: (planet) => {
				setStore({ selectedPlanet: planet, selectedCharacter: null, selectedVehicle: null });
			},

			// Guardar el vehículo seleccionado
			setSelectedVehicle: (vehicle) => {
				setStore({ selectedVehicle: vehicle, selectedCharacter: null, selectedPlanet: null });
			},
		}
	};
};

export default getState;
