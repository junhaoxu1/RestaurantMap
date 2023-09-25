import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const HomePage = () => {

	return (
		<>
			<main>
				<h1>Enjoy Food</h1>
				<Link to={"/food-map"}>
					<Button>
						Food-Scouting🗺️
					</Button>
				</Link>
			</main>
		</>
	)
}

export default HomePage
