import useGetDocument from "../hooks/useGetDocument"
import { Restaurant } from "../types/restaurants.types"
import { restaurantsCol } from "../services/firebase"
import { useParams } from "react-router-dom"
import RestaurantDetails from "../components/RestaurantDetails"

const RestaurantPage = () => {
    const { id } = useParams()

    const documentId = String(id)

    if (!documentId) return <p>Restaurant doesn't exist</p>

    const { data: restaurant, loading } = useGetDocument<Restaurant>(restaurantsCol, documentId)

    console.log("Test:" , restaurant)

    if (!restaurant || loading) {
        return <p>Loading...</p>
    }

    return (
        <>
            <RestaurantDetails restaurant={restaurant} />
        </>
    )
}

export default RestaurantPage
