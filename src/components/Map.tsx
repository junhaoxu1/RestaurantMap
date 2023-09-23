import { useEffect, useMemo, useRef, useState } from "react"
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api"
import { Link, useSearchParams } from "react-router-dom"
import React from "react"
import { Restaurant, Restaurants } from "../types/restaurants.types"
import RestaurantIcon from "../assets/images/restauranticon.webp"
import RestaurantListItem from "./RestaurantListItem"
import PlacesAutoComplete from "./PlacesAutoComplete"
import { LatLng } from "use-places-autocomplete"

type MapOptions = google.maps.MapOptions

type MarkerLocationProps = {
    restaurants: Restaurants
}

const Map: React.FC<MarkerLocationProps> = ({ restaurants }) => {
    // it remember to locationen by setting latitude and longitude
    const center = useMemo(() => ({ lat: 55.6053, lng: 13.0041 }), [])

    const [gCurrentPos, setGCurrentPos] = useState<google.maps.LatLngLiteral>({} as google.maps.LatLngLiteral)
    const [_disabled, setDisabled] = useState(false)
    const [selectedClickMarker, setSelectedClickMarker] = useState<Restaurant>({} as Restaurant)
    const [place, setPlace] = useState<LatLng | null>(null)

    //removing googleMaps zoom in&out button and other button inside MapOptions.
    const options = useMemo<MapOptions>(
        () => ({
            disableDefaultUI: true,
            clickableIcons: false,
        }),
        []
    )

    const [_searchParams, setSearchParams] = useSearchParams({
        query: "",
    })

    // calculate distance in km between coordinates
    function getDistanceFromLatLngInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
        var R = 6371 // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1) // deg2rad below
        var dLon = deg2rad(lon2 - lon1)
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        var d = R * c // Distance in km

        console.log("distance in km", d)
        return d.toFixed(2)
    }

    function deg2rad(deg: any) {
        return deg * (Math.PI / 180)
    }

    const handlePlaceForm = async (query: string) => {
        //set input value as query in searchParams and while getting result
        setSearchParams({ query })
    }

    // mapReference can either be reference to google maps or null
    const mapReference = useRef<google.maps.Map | null>(null)

    // getting current position on the google maps by updating state variable getCurrentPos while clicking the icon button
    const gCurrentPosition = (position: google.maps.LatLngLiteral) => {
        if (mapReference.current) {
            mapReference.current.panTo({ lat: position.lat, lng: position.lng })
            mapReference.current.setZoom(14)
            setGCurrentPos(position)
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
    const ShowMapClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) {
            return
        }
        setGCurrentPos({ lat: e.latLng.lat(), lng: e.latLng.lng() })
        setSelectedClickMarker({} as Restaurant)
    }

    const ShowMarkerClick = (marker: Restaurant) => setSelectedClickMarker(marker)

    useEffect(() => {
        // sets a default position on initial map render
        setGCurrentPos({
            lat: 55.60697,
            lng: 13.02106,
        })

        // ask for user's location
        navigator.geolocation.getCurrentPosition((position) => {
            // Click the button when geolocation has finished loaded
            setDisabled(false)

            // calls on function that updated position, and adjusts map
            gCurrentPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            })
        })
    }, [])

    return (
        <>
            <div className="d-flex">
                <RestaurantListItem restaurants={restaurants} displayOnMap={(e) => ShowMarkerClick(e)} />
                <div className="cBox">
                    {/* <Button
                        onClick={() => {
                            navigator.geolocation.getCurrentPosition((position) => {
                                // Click the button when geolocation has finished loaded
                                setDisabled(false)
                                // get the callback function for your position
                                gCurrentPosition({
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                })
                            })
                        }}
                        style={{ color: "grey", background: "black", position: "absolute", zIndex: "2", left: "0", top: "50px" }}
                    >
                        <i className="fa-solid fa-location-crosshairs"></i>
                    </Button> */}

                    <PlacesAutoComplete
                        setPlace={(place) => {
                            setPlace(place), mapReference.current?.panTo(place)
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
                            {gCurrentPos.lat && <Marker position={gCurrentPos} />}
                            {gCurrentPos.lat &&
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
                                                gCurrentPos.lat,
                                                gCurrentPos.lng,
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
