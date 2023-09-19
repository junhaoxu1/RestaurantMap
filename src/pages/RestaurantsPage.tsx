import useGetCollection from "../hooks/useGetCollection"
import { newRestaurantCol, restaurantsCol } from "../services/firebase"
import { Restaurant, RestaurantFormData } from "../types/restaurants.types"
import AddNewRestaurantForm from "../components/AddNewRestaurantForm"
import { doc, setDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import { getGeocode } from "../services/Geocode"
import RestaurantCard from "../components/RestaurantCard"

const RestaurantsPage = () => {
    const { data: restaurants, error, loading } = useGetCollection<Restaurant>(restaurantsCol)

    // add a new restaurant to db
    const addNewRestaurant = async (data: RestaurantFormData) => {
        try {
            // get geo code for the submitted address
            const res = await getGeocode(data.address)

            // add new document to `restaurants` collection in db
            const docRef = doc(newRestaurantCol)

            // set content of the document
            await setDoc(docRef, {
                ...data,
                geolocation: {
                    lat: res.lat,
                    lng: res.lng,
                },
            })
        } catch (err: any) {
            toast.error(err.message)
        }

        toast.success("Form successfully sent. Thank you!")
    }

    if (!restaurants || loading) {
        return <p>Loading</p>
    }

    return (
        <div>
            {loading && <p>Loading restaurants...</p>}

            <RestaurantCard restaurants={restaurants} />

            {/* <AddNewRestaurantForm onAddRestaurant={addNewRestaurant} /> */}

            {error && <p>Something went wrong: {error}</p>}
        </div>
    )
}

export default RestaurantsPage
