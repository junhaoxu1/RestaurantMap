import { doc, deleteDoc, setDoc } from 'firebase/firestore'
import { useState } from "react"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Image from "react-bootstrap/Image"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from 'react-toastify'
import Confirmation from "../components/Confirmation"
import useAuth from '../hooks/useAuth'
import useGetRequest from "../hooks/useGetRequest"
import { restaurantRequestCol, newRestaurantCol } from '../services/firebase'
import { RestaurantFormData } from '../types/restaurants.types'

const RestaurantRequestPage = () => {
	const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [showConfirmApprove, setShowConfirmApprove ] = useState(false)
	const navigate = useNavigate()
	const { id } = useParams()
	const { currentUser } = useAuth()

	const documentId = id as string

	const {
		data: restaurant,
		loading
	} = useGetRequest(documentId)

    const approveRequest = async () => {
		const firstDocRef = doc(restaurantRequestCol, documentId)
        const secondDocRef = doc(newRestaurantCol, documentId)

        await deleteDoc(firstDocRef)

        const restaurantData = {
            ...restaurant,
          };


		await setDoc(secondDocRef, restaurantData)

        toast.success(`${restaurant?.name} has been approved`)

        navigate('/users-request', {
            replace: true
        })
    }

	const deleteRequest = async () => {
		const docRef = doc(restaurantRequestCol, documentId)

		await deleteDoc(docRef)

		toast.success("Request deleted")

		navigate('/users-request', {
			replace: true,
		})
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
					variant="success"
					onClick={() => setShowConfirmApprove(true)}
				>
					Approve
				</Button>
			</div>

            <Confirmation
				show={showConfirmApprove}
				onCancel={() => setShowConfirmDelete(false)}
				onConfirm={approveRequest}
			>
				Do you want to approve {restaurant.name}?
			</Confirmation>

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
		</Container>
	)
}

export default RestaurantRequestPage
