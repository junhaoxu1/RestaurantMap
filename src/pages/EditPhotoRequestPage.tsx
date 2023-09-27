import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import { useState } from "react"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Confirmation from "../components/Confirmation"
import { newRestaurantCol, photoRequestCol } from "../services/firebase"
import useGetDocument from "../hooks/useGetDocument"
import Image from "react-bootstrap/Image"

const EditPhotoRequestPage = () => {
	const [showConfirmDelete, setShowConfirmDelete] = useState(false)
	const [showConfirmApprove, setShowConfirmApprove] = useState(false)
	const navigate = useNavigate()
	const { id } = useParams()

	const documentId = id as string

	const { data: restaurant, loading } = useGetDocument(photoRequestCol, documentId)

	console.log(documentId)

	const approveRequest = async () => {
		const firstDocRef = doc(photoRequestCol, documentId)
		const secondDocRef = doc(newRestaurantCol, documentId)

		await deleteDoc(firstDocRef)

		const restaurantData = {
			...restaurant,
		}

		await updateDoc(secondDocRef, restaurantData)

		toast.success(`${restaurant?.name} has been approved`)

			navigate("/photos-request", {
				replace: true,
			})
	}

	const deleteRequest = async () => {
		const docRef = doc(photoRequestCol, documentId)

		await deleteDoc(docRef)

		toast.success("Request deleted")

		navigate("/photos-request", {
			replace: true,
		})
	}

	if (loading || !restaurant) {
		return <p>Loading...</p>
	}

	return (
		<Container className="py-3">
			<div className="d-flex justify-content-center">
				<h1>{restaurant.name}</h1>
			</div>

			{restaurant.user_photos?.map((photo) => (
				<Image src={photo.photo} />
			))}

			<div className="d-flex justify-content-center">
				<Link to="/">
					<Button variant="secondary">&laquo; Go Back</Button>
				</Link>
				<Button variant="danger" onClick={() => setShowConfirmDelete(true)}>
					Delete
				</Button>
				<Button variant="success" onClick={() => setShowConfirmApprove(true)}>
					Approve
				</Button>
			</div>

			<Confirmation show={showConfirmApprove} onCancel={() => setShowConfirmApprove(false)} onConfirm={approveRequest}>
				Do you want to approve this photo??
			</Confirmation>

			<Confirmation show={showConfirmDelete} onCancel={() => setShowConfirmDelete(false)} onConfirm={deleteRequest}>
				Do you want to delete this photo??
			</Confirmation>
		</Container>
	)
}

export default EditPhotoRequestPage
