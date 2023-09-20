import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const HomePage = () => {
	const {currentUser } = useAuth()

	return (
		<>
			<main>
				<h1>Enjoy Food</h1>
				<p>Logged in as {currentUser?.uid}</p>
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
