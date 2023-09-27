import React, { useEffect, useState } from "react"
import Card from "react-bootstrap/Card"
import { Restaurants } from "../types/restaurants.types"
import { Link } from "react-router-dom"

type Props = {
    restaurants: Restaurants
}

const placeholderImage =
    "https://images.unsplash.com/photo-1477506252414-b2954dbdacf3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fHBsYWNlaG9sZGVyJTIwcGhvdG8lMjBmb29kfGVufDB8MHwwfHx8Mg%3D%3D&auto=format&fit=crop&w=500&q=60"

const RestaurantCard: React.FC<Props> = ({ restaurants }) => {
	const [sortRestaurang, setSortRestaurang ] = useState(restaurants)
	const [sortIdOrder, setSortIdOrder] = useState<string>("asc")

  	const [sortShopsName, _setSortShopsName] = useState<string>("")

	useEffect(() => {
		// sorting a copy of a restaurang based on sortIdOrderOrder that contain alphabetic order
		const sortedRShops = [...sortRestaurang].sort((a,b) => {
			return sortIdOrder === "asc"
				? a.name.localeCompare(b.name)
				: b.name.localeCompare(a.name)
		})

		// updating sortedRestaurang states
		setSortRestaurang(sortedRShops)
	}, [sortIdOrder])

	// updates sorting state order for restaurang in desc or asc while triggering the sorting list.
	const sortHandlerRShops = (rshop: string) => {
		setSortIdOrder(rshop)
	}

	// this contain only for selected list of sortedrestaurants in descending or ascending order.
	const sortedrestaurants = sortRestaurang.filter((rShops) => {
		return (
			(sortShopsName === "" || rShops.name === sortShopsName) &&
			rShops.name.toLowerCase()
		)
	})

    return (
        <>
			<select
				className="mt-3 shadow text-center"
				style={{ width: "18rem", height: "3rem" }}
				value={sortIdOrder}
				onChange={(event) => sortHandlerRShops(event.target.value)}
			>
				<option value="asc">Ascending name order</option>
				<option value="desc">Descending name order</option>
			</select>

            <ul className="d-flex gap-3 flex-wrap mt-3 px-0 justify-content-center">
                {sortedrestaurants.map((restaurant) => (
                    <li key={restaurant._id} style={{ listStyle: "none" }}>
                        <Card className="mt-3 shadow text-center" style={{ width: "18rem", border: "none" }}>
                            <Card.Img variant="top" src={restaurant.cover_photo ?? placeholderImage} className="img-fluid" />
                            <Card.Body>
                                <Card.Title className="card-heading">{restaurant.name}</Card.Title>
                                <div className="line"></div>
                                <Card.Text className="card-text">{restaurant.description}</Card.Text>
                            </Card.Body>
                            <Link to={`/restaurants/${restaurant._id}`} className="link">
                                Discover more
                            </Link>
                        </Card>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default RestaurantCard
