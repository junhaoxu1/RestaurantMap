import React from "react"
import { Restaurant, Restaurants } from "../types/restaurants.types"
import Image from "react-bootstrap/Image"
import { getDistanceFromLatLngInKm } from "../helpers/getDistance"
import { useSearchParams } from "react-router-dom"

type Props = {
    restaurants: Restaurants
    displayOnMap: (restaurant: Restaurant) => void
    coordinates: { lat: number; lng: number }
}

const placeholderImage =
    "https://images.unsplash.com/photo-1477506252414-b2954dbdacf3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fHBsYWNlaG9sZGVyJTIwcGhvdG8lMjBmb29kfGVufDB8MHwwfHx8Mg%3D%3D&auto=format&fit=crop&w=500&q=60"

const RestaurantListItem: React.FC<Props> = ({ restaurants, displayOnMap, coordinates }) => {
    const [searchParams, _setSearchParams] = useSearchParams({})
    const position = { lat: searchParams.get("lat"), lng: searchParams.get("lng") }
    return (
        <>
            <ul className="px-0 w-100 list-group">
                {restaurants.map((restaurant) => (
                    <li className="d-flex w-100 gap-2 mt-1 list-item" onClick={() => displayOnMap(restaurant)} key={restaurant._id}>
                        <Image src={restaurant.cover_photo ?? placeholderImage} className="list-item-image" />

                        <div className="line"></div>

                        <div className="text-wrapper d-flex flex-column">
                            <p className="list-item-heading">{restaurant.name}</p>
                            <p className="list-item-text">
                                {restaurant.address}, {restaurant.city}{" "}
                                {position.lat !== null && (
                                    <span className="text-muted" style={{ fontSize: ".75rem" }}>
                                        (
                                        {getDistanceFromLatLngInKm(
                                            restaurant.geolocation.lat,
                                            restaurant.geolocation.lng,
                                            coordinates.lat,
                                            coordinates.lng
                                        )}{" "}
                                        km)
                                    </span>
                                )}
                            </p>
                            <p className="list-item-text">
                                {restaurant.category}, {restaurant.supply}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default RestaurantListItem
