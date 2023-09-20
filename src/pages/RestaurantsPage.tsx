import useGetCollection from "../hooks/useGetCollection"
import { restaurantsCol } from "../services/firebase"
import { Restaurant } from "../types/restaurants.types"
import RestaurantCard from "../components/RestaurantCard"
import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"

const RestaurantsPage = () => {
    const { data: restaurants, error, loading } = useGetCollection<Restaurant>(restaurantsCol)

    if (!restaurants || loading) {
        return <p>Loading</p>
    }

    return (
        <div>
            {loading && <p>Loading restaurants...</p>}

            <RestaurantCard restaurants={restaurants} />

            <Button className="my-5 d-flex mx-auto" style={{ backgroundColor: "crimson", border: "none", padding: "1rem" }}>
                <Link to="/restaurants/add" style={{ textDecoration: "none", color: "white" }}>
                    Missing a restaurant? Let us know!
                </Link>
            </Button>

            {error && <p>Something went wrong: {error}</p>}
        </div>
    )
}

export default RestaurantsPage
