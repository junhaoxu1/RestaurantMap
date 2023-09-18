import { Link } from 'react-router-dom'
import useGetCollection from '../hooks/useGetCollection'
import { restaurantsCol } from '../services/firebase'
import { Restaurant } from '../types/restaurants.types'
import ListGroup from 'react-bootstrap/ListGroup'


const RestaurantsPage = () => {
    const { data: restaurants, loading } = useGetCollection<Restaurant>(restaurantsCol)

    if (!restaurants || loading) {
        return <p>Loading</p>

    }

    return (
        <div>

            {loading && <p>Loading restaurants...</p>}
            <ListGroup>
                {restaurants.map(restaurant => (
                    <ListGroup.Item
                        key={restaurant.name}
                        action
                        as={Link}
                        to={`/restaurants/${restaurant._id}`}
                    >
                        <p>{restaurant.name}</p>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    )
}

export default RestaurantsPage