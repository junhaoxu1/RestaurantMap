import useGetDocument from '../hooks/useGetDocument'
import { Restaurant } from '../types/restaurants.types'
import { restaurantsCol } from '../services/firebase'
import { useParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

const RestaurantPage = () => {

    const { id } = useParams()

    const documentId = String(id)

    if (!documentId) return <p>Restaurant doesn't exist</p>

    const { data: restaurant, loading } = useGetDocument<Restaurant>(restaurantsCol, documentId)

    if (!restaurant || loading) {
        return <p>Loading...</p>
    }

    return (
        <Container>
            <h1>{restaurant.name}</h1>

            <p>{restaurant.address}</p>
            <p>{restaurant.city}</p>

        </Container>
    )
}

export default RestaurantPage