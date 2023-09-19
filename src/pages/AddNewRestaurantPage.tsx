import { RestaurantFormData } from "../types/restaurants.types"
import { getGeocode } from "../services/Geocode"
import { doc, setDoc } from "firebase/firestore"
import { newRestaurantCol } from "../services/firebase"
import { toast } from "react-toastify"
import AddNewRestaurantForm from "../components/AddNewRestaurantForm"

const AddNewRestaurantPage = () => {
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

    return (
        <>
            <AddNewRestaurantForm onAddRestaurant={addNewRestaurant} />
        </>
    )
}

export default AddNewRestaurantPage
