import { doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { useState } from "react"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Image from "react-bootstrap/Image"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from 'react-toastify'
import Confirmation from "../components/Confirmation"
import { restaurantsCol } from '../services/firebase'
import AddNewRequestForm from '../components/AddNewRequestForm'
import { RestaurantFormData } from '../types/restaurants.types'
import useGetRestaurant from '../hooks/useGetRestaurant'

const EditRestaurantPage = () => {
	const [showConfirmDelete, setShowConfirmDelete] = useState(false)
	const navigate = useNavigate()
	const { id } = useParams()

	const documentId = id as string

	const {
		data: restaurant,
		loading
	} = useGetRestaurant(documentId)

	const deleteRequest = async () => {
		const docRef = doc(restaurantsCol, documentId)

		await deleteDoc(docRef)

		toast.success("Request deleted")

		navigate('/admin-restaurants', {
			replace: true,
		})
	}

    const editRequest = async (data: RestaurantFormData) => {
        const docRef = doc(restaurantsCol, documentId)

        const restuarantData = {
            ...data
        }

        await updateDoc(docRef, restuarantData)

        toast.success("Restaurant Updated")
    }

	if (loading || !restaurant) {
		return <p>Loading...</p>
	}

	return (
		<Container className="py-3">
			<div className="d-flex justify-content-between align-items-start">
				<h1>{restaurant.name}</h1>
			</div>

			<div className="buttons mb-3">
				<Button
					variant="danger"
					onClick={() => setShowConfirmDelete(true)}
				>
					Delete
				</Button>
			</div>

			<Confirmation
				show={showConfirmDelete}
				onCancel={() => setShowConfirmDelete(false)}
				onConfirm={deleteRequest}
			>
				Do you want to delete {restaurant.name}?
			</Confirmation>

			<Link to="/users-request">
				<Button variant="secondary">&laquo; Go Back</Button>
			</Link>

            <AddNewRequestForm onAddRestaurant={editRequest}/>
		</Container>
	)
}

export default EditRestaurantPage
