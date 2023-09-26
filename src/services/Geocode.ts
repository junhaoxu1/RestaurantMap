import axios from "axios"
import { GeoCodingResponse } from "../types/Geocoding.types"
import { LatLng } from "use-places-autocomplete"

const API_KEY = import.meta.env.VITE_APP_GOOGLE_KEY

// get longitude and latituted from an address
export const getGeocode = async (location: string, city: string) => {
    const response = await axios.get<GeoCodingResponse>("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
            address: `${location},${city}`,
            key: API_KEY,
        },
    })

    const geoLocation = response.data.results[0].geometry.location

    return geoLocation
}

// get longitute and latitute from a place id
export const getGeocodeFromPlaceId = async (place_id: string) => {
    const response = await axios.get<GeoCodingResponse>("https://maps.googleapis.com/maps/api/place/details/json", {
        params: {
            placeid: place_id,
            key: API_KEY,
        },
    })

    const address = response.data.results[0].formatted_address
    return address
}

// get town name from lat and long
export const getLocationWithLatLng = async (coordinates: LatLng) => {
    const response = await axios.get<GeoCodingResponse>("https://maps.googleapis.com/maps/api/geocode/json?", {
        params: {
            latlng: `${coordinates.lat}, ${coordinates.lng}`,
            key: API_KEY,
        },
    })

    return response.data
}
