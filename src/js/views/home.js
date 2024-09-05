import React from "react";
import Planets from "../component/planets.jsx";
import Star from "../animation/start.jsx";
import Characters from "../component/characters.jsx";
import Vehicles from "../component/vehicles.jsx";

export const Home = () => {
	return (
		<div>
			<Star />
			<Characters />
			<Planets />
			<Vehicles />
		</div>
	);
};
