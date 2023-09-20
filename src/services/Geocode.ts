import axios from "axios"
import { GeoCodingResponse } from "../types/Geocoding.types"

const API_KEY = import.meta.env.VITE_APP_GOOGLE_KEY

// get longitude and latituted from an address
export const getGeocode = async (location: string) => {
    const response = await axios.get<GeoCodingResponse>('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: location,
            key: API_KEY
        }
    })

    const geoLocation = response.data.results[0].geometry.location

    return geoLocation
}