import { useLoadScript } from "@react-google-maps/api"
import Map from "../components/Map"
import useGetCollection from "../hooks/useGetCollection"
import { Restaurant } from "../types/restaurants.types"
import { restaurantsCol } from "../services/firebase"
import { useEffect, useMemo, useRef, useState } from "react"
import RestaurantListItem from "../components/RestaurantListItem"
import PlacesAutoComplete from "../components/PlacesAutoComplete"
const MYMAPSKEY = import.meta.env.VITE_APP_GOOGLE_KEY

const MapPage = () => {
    // where map will be centered around on reload
    const center = useMemo(() => ({ lat: 55.6053, lng: 13.0041 }), [])

    const mapReference = useRef<google.maps.Map | null>(null)

    const { data, error, loading } = useGetCollection<Restaurant>(restaurantsCol)
    const [coordinates, setCoordinates] = useState({} as { lat: number; lng: number })
    const [type, setType] = useState<string | null>(null)
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>({} as Restaurant)

    // Loading Google Maps by using useLoadScript hook and libary places,
    // it also used to determine when API is fully loaded.
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: MYMAPSKEY,
        libraries: ["places"],
    })

    // return updated reference with current map for interacting with google maps
    const onMapLoadInstance = (map: google.maps.Map): void => {
        mapReference.current = map
    }

    const onUnMount = (): void => {
        mapReference.current = null
    }

    const showRestaurantsInfo = (marker: Restaurant) => setSelectedRestaurant(marker)

    const displayOnMap = (restaurant: Restaurant) => {
        if (!mapReference.current) return
        showRestaurantsInfo(restaurant)
        mapReference.current.panTo({ lat: restaurant.geolocation.lat, lng: restaurant.geolocation.lng })
    }

    // get the users location on render
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            console.log({ latitude, longitude })
            setCoordinates({ lat: latitude, lng: longitude })
        })
    }, [])

    useEffect(() => {
        if (!mapReference.current) {
            return
        }

        mapReference.current.panTo(coordinates)
        console.log("coordinates:", coordinates)
    }, [coordinates])

    if (!data) return

    return (
        <>
            <div className="d-flex">
                <div className="d-flex flex-column">
                    <PlacesAutoComplete setCoordinates={setCoordinates} />

                    <RestaurantListItem displayOnMap={displayOnMap} restaurants={data} />
                </div>
                <section className="map-page">
                    <Map
                        onMapLoadInstance={onMapLoadInstance}
                        onUnMount={onUnMount}
                        center={center}
                        coordinates={coordinates}
                        setCoordinates={setCoordinates}
                        restaurants={data}
                        showRestaurantsInfo={showRestaurantsInfo}
                        selectedRestautant={selectedRestaurant}
                        setSelectedRestaurant={setSelectedRestaurant}
                    />
                </section>
            </div>

            {error && <p>Something went wrong: {error}</p>}
        </>
    )
}

export default MapPage
