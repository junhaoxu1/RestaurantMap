import { doc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useState } from "react"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from 'react-toastify'
import Confirmation from "../components/Confirmation"
import useGetRequest from "../hooks/useGetRequest"
import { restaurantRequestCol, newRestaurantCol } from '../services/firebase'
import AddNewRequestForm from '../components/AddNewRequestForm'
import { RestaurantFormData } from '../types/restaurants.types'

const RestaurantRequestPage = () => {
	const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [showConfirmApprove, setShowConfirmApprove ] = useState(false)
	const navigate = useNavigate()
	const { id } = useParams()

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

	const deleteImage = async (index: number) => {
		const updatedRestaurant = { ...restaurant };
	  
		if (updatedRestaurant.user_photos && index >= 0 && index < updatedRestaurant.user_photos.length) {
		  updatedRestaurant.user_photos.splice(index, 1);
	  
		  const docRef = doc(restaurantRequestCol, documentId);
		  const updatedData = {
			...updatedRestaurant,
		  };
	  
		  await updateDoc(docRef, updatedData);
		  toast.success("Image deleted successfully");
		}
	  };

    const editRequest = async (data: RestaurantFormData) => {
        const docRef = doc(restaurantRequestCol, documentId)

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
			<div className="d-flex justify-content-center">
				<h1>{restaurant.name}</h1>
			</div>

			<AddNewRequestForm onAddRestaurant={editRequest} currentRestaurant={restaurant} onDeleteImage={deleteImage}/>

            <div className="d-flex justify-content-center">
			<Link to="/users-request">
				<Button variant="secondary">&laquo; Go Back</Button>
			</Link>
				<Button
					variant="danger"
					onClick={() => setShowConfirmDelete(true)}
				>
					Delete
				</Button>
				<Button
					variant="success"
					onClick={() => setShowConfirmApprove(true)}
				>
					Approve
				</Button>
			</div>

            <Confirmation
				show={showConfirmApprove}
				onCancel={() => setShowConfirmApprove(false)}
				onConfirm={approveRequest}
			>
				Do you want to approve {restaurant.name}?
			</Confirmation>

			<Confirmation
				show={showConfirmDelete}
				onCancel={() => setShowConfirmDelete(false)}
				onConfirm={deleteRequest}
			>
				Do you want to delete {restaurant.name}?
			</Confirmation>
		</Container>
	)
}

export default RestaurantRequestPage
