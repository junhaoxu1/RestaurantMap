import React from "react"
import Card from "react-bootstrap/Card"
import { Restaurants } from "../types/restaurants.types"
import { Link } from "react-router-dom"

type Props = {
    restaurants: Restaurants
}

const placeholderImage =
    "https://images.unsplash.com/photo-1477506252414-b2954dbdacf3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fHBsYWNlaG9sZGVyJTIwcGhvdG8lMjBmb29kfGVufDB8MHwwfHx8Mg%3D%3D&auto=format&fit=crop&w=500&q=60"

const RestaurantCard: React.FC<Props> = ({ restaurants }) => {
    return (
        <>
            <ul className="d-flex gap-3 flex-wrap justify-content-center mt-3">
                {restaurants.map((restaurant) => (
                    <Card className="mt-3 shadow text-center" style={{ width: "18rem", border: "none" }}>
                        <Card.Img variant="top" src={restaurant.cover_photo ?? placeholderImage} className="img-fluid" />
                        <Card.Body>
                            <Card.Title className="card-heading">{restaurant.name}</Card.Title>
                            <div className="line"></div>
                            <Card.Text className="card-text">{restaurant.description}</Card.Text>
                        </Card.Body>
                        <Link to={`/restaurants/${restaurant._id}`} key={restaurant._id} className="link">
                            Discover more
                        </Link>
                    </Card>
                ))}
            </ul>
        </>
    )
}

export default RestaurantCard
