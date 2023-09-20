import React from "react"
import Image from "react-bootstrap/Image"
import { Restaurant } from "../types/restaurants.types"
import Card from "react-bootstrap/Card"
import { FaFacebook, FaInstagram } from "react-icons/fa"
import { Container } from "react-bootstrap"

type Props = {
    restaurant: Restaurant
}

const RestaurantDetails: React.FC<Props> = ({ restaurant }) => {
    return (
        <>
            <div className="banner d-flex">
                <Image src={restaurant.cover_photo} style={{ width: "100%", objectFit: "cover" }} />
                <p className="h2 w-100 text-center my-auto py-3">{restaurant.name}</p>
            </div>

            <Container className="restaurant-content mx-auto">
                <div className="card-wrapper mb-5">
                    <Card className="mt-3 shadow">
                        <Card.Body>
                            <Card.Title className="card-heading">Information</Card.Title>
                            <Card.Text className="card-text mt-3">
                                <span className="details-subheading">About the restaurant:</span> <br /> {restaurant.description}
                            </Card.Text>
                            <Card.Text className="card-text mt-3">
                                <span className="details-subheading">Tags:</span> <br /> {restaurant.supply}, {restaurant.category}
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className="mt-3 shadow">
                        <Card.Body>
                            <Card.Title className="card-heading">Contact</Card.Title>
                            <Card.Text className="card-text mt-3">
                                <span className="details-subheading">Location:</span> <br /> {restaurant.address}, {restaurant.city}
                            </Card.Text>
                            <Card.Text className="card-text mt-3">
                                <span className="details-subheading">Phone:</span> <br /> {restaurant.phone || "N/A"}
                            </Card.Text>
                            <Card.Text className="card-text mt-3">
                                <span className="details-subheading">Email:</span> <br /> {restaurant.email || "N/A"}
                            </Card.Text>
                            <Card.Text className="card-text mt-3">
                                <span className="details-subheading">Website:</span> <br />{" "}
                                <a href={`https://${restaurant.webpage}`} target="_blank">
                                    {restaurant.webpage || "N/A"}
                                </a>
                            </Card.Text>
                            <Card.Text className="card-text mt-3">
                                <span className="details-subheading">Social Media:</span> <br />
                                <div className="social-media-container d-flex gap-2">
                                    {!restaurant.email && !restaurant.facebook && !restaurant.instagram && <p>Data missing</p>}
                                    {restaurant.facebook !== "" && (
                                        <a href={restaurant.facebook} className="fa-icon">
                                            <FaFacebook />
                                        </a>
                                    )}
                                    {restaurant.instagram !== "" && (
                                        <a href={restaurant.instagram} className="fa-icon">
                                            <FaInstagram />
                                        </a>
                                    )}
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </>
    )
}

export default RestaurantDetails
