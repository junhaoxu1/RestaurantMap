import React from "react"
import { Restaurants } from "../types/restaurants.types"
import Card from "react-bootstrap/Card"
import Image from "react-bootstrap/Image"
import ListGroup from "react-bootstrap/ListGroup"

type Props = {
    restaurants: Restaurants
}

const placeholderImage =
    "https://images.unsplash.com/photo-1477506252414-b2954dbdacf3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fHBsYWNlaG9sZGVyJTIwcGhvdG8lMjBmb29kfGVufDB8MHwwfHx8Mg%3D%3D&auto=format&fit=crop&w=500&q=60"

const RestaurantListItem: React.FC<Props> = ({ restaurants }) => {
    return (
        <>
            <ul className="px-0 w-100 list-group">
                {restaurants.map((restaurant) => (
                    <li className="d-flex w-100 gap-2 mt-1 list-item">
                        <Image src={restaurant.cover_photo ?? placeholderImage} style={{ width: "9rem", objectFit: "cover" }} />

                        <div className="line"></div>

                        <div className="text-wrapper d-flex flex-column justify-content-evenly">
                            <p className="list-item-text h5">{restaurant.name}</p>
                            <p className="list-item-text">
                                {restaurant.address}, {restaurant.city}
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
