import { useEffect, useMemo, useRef, useState } from "react"
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api"
import { Link, useSearchParams } from "react-router-dom"
import React from "react"
import { Restaurant, Restaurants } from "../types/restaurants.types"
import RestaurantIcon from "../assets/images/restauranticon.webp"
import RestaurantListItem from "./RestaurantListItem"
import PlacesAutoComplete from "./PlacesAutoComplete"
import { LatLng } from "use-places-autocomplete"
import { getDistanceFromLatLngInKm } from "../helpers/getDistance"

type MapOptions = google.maps.MapOptions

type MarkerLocationProps = {
    restaurants: Restaurants
}

const Map: React.FC<MarkerLocationProps> = ({ restaurants }) => {
    // it remember to locationen by setting latitude and longitude
    const center = useMemo(() => ({ lat: 55.6053, lng: 13.0041 }), [])

    const [currentPosition, setCurrentPosition] = useState<LatLng>({} as LatLng)
    const [_disabled, setDisabled] = useState(false)
    const [selectedClickMarker, setSelectedClickMarker] = useState<Restaurant>({} as Restaurant)
    const [place, setPlace] = useState<LatLng | null>(null)
    const [searchParams, setSearchParams] = useSearchParams({
        lat: "",
        lng: "",
    })

    // grab the current lat and long from url
    const selectedLat = searchParams.get("lat")
    const selectedLng = searchParams.get("lng")

    //removing googleMaps zoom in&out button and other button inside MapOptions.
    const options = useMemo<MapOptions>(
        () => ({
            disableDefaultUI: true,
            clickableIcons: false,
        }),
        []
    )

    // mapReference can either be reference to google maps or null
    const mapReference = useRef<google.maps.Map | null>(null)

    // getting current position on the google maps by updating state variable getCurrentPos while clicking the icon button
    const getUsersPosition = async (position: google.maps.LatLngLiteral) => {
        if (mapReference.current) {
            mapReference.current.panTo({ lat: position.lat, lng: position.lng })
            mapReference.current.setZoom(14)
            setCurrentPosition(position)

            // update url with user's position
            setSearchParams({ lat: String(position.lat), lng: String(position.lng) })
        }
    }

    // return updated reference with current map for interacting with google maps
    const onMapLoadInstance = (map: google.maps.Map): void => {
        mapReference.current = map
    }

    const onUnMount = (): void => {
        mapReference.current = null
    }

    // show location where you click on the map
    const ShowMapClick = async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) {
            return
        }
        setCurrentPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })
        setSelectedClickMarker({} as Restaurant)

        // update url with current position
        setSearchParams({ lat: String(e.latLng.lat()), lng: String(e.latLng.lng()) })
    }

    const ShowMarkerClick = (marker: Restaurant) => setSelectedClickMarker(marker)

    useEffect(() => {
        // sets a default position on initial map render
        // setCurrentPosition({
        //     lat: 55.60697,
        //     lng: 13.02106,
        // })

        // ask for user's location
        navigator.geolocation.getCurrentPosition((position) => {
            // Click the button when geolocation has finished loaded
            setDisabled(false)

            // calls on function that updated position, and adjusts map
            getUsersPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            })
        })
    }, [])

    useEffect(() => {
        if (!mapReference.current) {
            return
        }

        mapReference.current.panTo({ lat: Number(selectedLat), lng: Number(selectedLng) })
        setCurrentPosition({ lat: Number(selectedLat), lng: Number(selectedLng) })
    }, [selectedLat, selectedLat])

    return (
        <>
            <div className="d-flex">
                <RestaurantListItem restaurants={restaurants} displayOnMap={(e) => ShowMarkerClick(e)} />
                <div className="cBox">
                    <PlacesAutoComplete
                        setPlace={(place) => {
                            setPlace(place), mapReference.current?.panTo(place), setCurrentPosition(place)
                        }}
                    />

                    <div className="map">
                        <GoogleMap
                            zoom={12}
                            center={center}
                            mapContainerClassName="map-container"
                            options={options}
                            onLoad={onMapLoadInstance}
                            onClick={ShowMapClick}
                            onUnmount={onUnMount}
                        >
                            {place && <Marker position={place} />}
                            {currentPosition.lat && <Marker position={currentPosition} />}
                            {currentPosition.lat &&
                                restaurants.map((restaurant) => (
                                    <Marker
                                        key={restaurant._id}
                                        position={restaurant.geolocation}
                                        onClick={() => ShowMarkerClick(restaurant)}
                                        icon={{
                                            url: RestaurantIcon,
                                            origin: new window.google.maps.Point(0, 0),
                                            anchor: new window.google.maps.Point(15, 15),
                                            scaledSize: new window.google.maps.Size(45, 45),
                                        }}
                                    />
                                ))}

                            {selectedClickMarker.geolocation && (
                                <InfoWindow position={selectedClickMarker.geolocation} onCloseClick={() => setSelectedClickMarker({} as Restaurant)}>
                                    <div>
                                        <h4>{selectedClickMarker.name}</h4>
                                        <p>
                                            {selectedClickMarker.address}, {selectedClickMarker.city} (
                                            {getDistanceFromLatLngInKm(
                                                currentPosition.lat,
                                                currentPosition.lng,
                                                selectedClickMarker.geolocation.lat,
                                                selectedClickMarker.geolocation.lng
                                            )}{" "}
                                            km)
                                        </p>
                                        <p>{selectedClickMarker.description}</p>

                                        <Link to={`/restaurants/${selectedClickMarker._id}`}>Read More</Link>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Map
