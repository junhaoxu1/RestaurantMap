import Container from "react-bootstrap/Container"
import { restaurantsCol, usersCol } from "../services/firebase"
import { UserFormData } from "../types/User.types"
import useAuth from "../hooks/useAuth"
import useGetCollection from "../hooks/useGetCollection"
import { useState, useEffect } from "react"
import { RestaurantFormData } from "../types/restaurants.types"
import AllRestaurantsTable from "../components/AllRestaurantsTable"

export const AllRestaurantsPage = () => {
	const { currentUser } = useAuth()

	const { data: restaurants, loading } = useGetCollection<RestaurantFormData>(restaurantsCol)
	const { data: users } = useGetCollection<UserFormData>(usersCol)

	const [documentData, setDocumentData] = useState<
		{
			_id: string
			address: string
			category: string
			city: string
			description: string
			email?: string
			facebook?: string
			instagram?: string
			name: string
			phone: string
			supply: string
			webpage: string
			geolocation: {
				lat: number
				lng: number
			}
			cover_photo?: string
		}[]
	>([])

	useEffect(() => {
		if (restaurants) {
			setDocumentData(restaurants)
		}
	}, [restaurants])

	const admins = users?.filter((user) => user.admin === true)

	return (
		<Container className="py-3">
			{loading ? (
				<p>Loading...</p>
			) : users && currentUser ? (
				admins?.some((admin) => admin.email === currentUser.email) ? (
					<AllRestaurantsTable data={documentData} />
				) : (
					<p>You do not have permission to view this page.</p>
				)
			) : (
				<p>Loading...</p>
			)}
		</Container>
	)
}

export default AllRestaurantsPage
