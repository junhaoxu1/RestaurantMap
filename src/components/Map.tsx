import { useEffect, useMemo, useRef, useState } from "react"
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api"
import { Link } from "react-router-dom"
import React from "react"
import { Restaurant, Restaurants } from "../types/restaurants.types"
import RestaurantIcon from "../assets/images/restauranticon.webp"
import { LatLng } from "use-places-autocomplete"
import { getDistanceFromLatLngInKm } from "../helpers/getDistance"

type MapOptions = google.maps.MapOptions

type Props = {
    restaurants: Restaurants
    coordinates: LatLng
    setCoordinates: (coordinates: LatLng) => void
    center: LatLng
    onMapLoadInstance: (map: google.maps.Map) => void
    onUnMount: () => void
    showRestaurantsInfo: (marker: Restaurant) => void
    selectedRestautant: Restaurant
    setSelectedRestaurant: (restaurant: Restaurant) => void
}

const Map: React.FC<Props> = ({
    center,
    restaurants,
    coordinates,
    setCoordinates,
    onMapLoadInstance,
    onUnMount,
    showRestaurantsInfo,
    selectedRestautant,
    setSelectedRestaurant,
}) => {
    //removing googleMaps zoom in&out button and other button inside MapOptions.
    const options = useMemo<MapOptions>(
        () => ({
            disableDefaultUI: true,
            clickableIcons: false,
        }),
        []
    )

    return (
        <>
            <div className="d-flex">
                <div className="cBox">
                    <div className="map">
                        <GoogleMap
                            zoom={12}
                            center={center}
                            mapContainerClassName="map-container"
                            options={options}
                            onLoad={onMapLoadInstance}
                            onClick={(e) => {
                                setCoordinates({ lat: e.latLng!.lat(), lng: e.latLng!.lng() })
                                console.log("new cords after clicking on map:", coordinates)
                            }}
                            onUnmount={onUnMount}
                        >
                            {coordinates && <Marker position={coordinates} />}
                            {restaurants &&
                                restaurants.map((restaurant) => (
                                    <Marker
                                        key={restaurant._id}
                                        position={restaurant.geolocation}
                                        onClick={() => showRestaurantsInfo(restaurant)}
                                        icon={{
                                            url: RestaurantIcon,
                                            origin: new window.google.maps.Point(0, 0),
                                            anchor: new window.google.maps.Point(15, 15),
                                            scaledSize: new window.google.maps.Size(45, 45),
                                        }}
                                    />
                                ))}

                            {selectedRestautant.geolocation && (
                                <InfoWindow position={selectedRestautant.geolocation} onCloseClick={() => setSelectedRestaurant({} as Restaurant)}>
                                    <div>
                                        <h4>{selectedRestautant.name}</h4>
                                        <p>
                                            {selectedRestautant.address}, {selectedRestautant.city} (
                                            {getDistanceFromLatLngInKm(
                                                coordinates.lat,
                                                coordinates.lng,
                                                selectedRestautant.geolocation.lat,
                                                selectedRestautant.geolocation.lng
                                            )}{" "}
                                            km)
                                        </p>
                                        <p>{selectedRestautant.description}</p>

                                        <Link to={`/restaurants/${selectedRestautant._id}`}>Read More</Link>
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
