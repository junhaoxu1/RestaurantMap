import { useLoadScript } from "@react-google-maps/api"
import Map from "../components/Map"
import useGetCollection from "../hooks/useGetCollection"
import { Restaurant } from "../types/restaurants.types"
import { restaurantsCol } from "../services/firebase"
const MYMAPSKEY = import.meta.env.VITE_APP_GOOGLE_KEY

const MapPage = () => {
    const { data: restaurants, error, loading } = useGetCollection<Restaurant>(restaurantsCol)

    // Loading Google Maps by using useLoadScript hook and libary places,
    // it also used to determine when API is fully loaded.
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: MYMAPSKEY,
        libraries: ["places"],
    })

    // if it flase then display loading otherwise stop display
    if (!isLoaded) {
        return <div>loading ... </div>
    }

    if (!restaurants || loading) {
        return <p>Loading</p>
    }

    return (
        <>
            <div className="d-flex">
                <section className="map-page">
                    <Map restaurants={restaurants} />
                </section>
            </div>

            {error && <p>Something went wrong: {error}</p>}
        </>
    )
}

export default MapPage
