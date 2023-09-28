import useGetDocument from "../hooks/useGetDocument"
import { Restaurant } from "../types/restaurants.types"
import { newRestaurantCol } from "../services/firebase"
import { useParams } from "react-router-dom"
import RestaurantDetails from "../components/RestaurantDetails"

const RestaurantPage = () => {
    const { id } = useParams();
    const documentId = String(id);
    const { data: restaurant, loading } = useGetDocument<Restaurant>(newRestaurantCol, documentId);
    

    if (!restaurant || loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <RestaurantDetails restaurant={restaurant} />
        </>
    );
}

export default RestaurantPage;