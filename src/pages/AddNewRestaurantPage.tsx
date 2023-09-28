import { RestaurantFormData } from "../types/restaurants.types"
import { getGeocode } from "../services/Geocode"
import { doc, setDoc, getDocs, query, where, collection } from "firebase/firestore"
import { newRestaurantCol, restaurantRequestCol, usersCol, db } from "../services/firebase"
import { toast } from "react-toastify"
import AddNewRestaurantForm from "../components/AddNewRestaurantForm"
import useAuth from "../hooks/useAuth"
import { useEffect, useState } from "react"
import useGetDocument from "../hooks/useGetDocument"

const AddNewRestaurantPage = () => {
	const { currentUser } = useAuth()

	const [userDocumentId, setUserDocumentId] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			if (currentUser) {
				try {
					const usersCollection = collection(db, "users")

					const checkId = query(usersCollection, where("uid", "==", currentUser.uid))

					const querySnapshot = await getDocs(checkId)

					if (querySnapshot.size === 1) {
						const userDoc = querySnapshot.docs[0]
						setUserDocumentId(userDoc.id)
					} else {
						console.error("User document not found.")
					}
				} catch (error) {
					console.error("Error fetching user data:", error)
				}
			}
		}
		fetchData()
	}, [currentUser])

	const { data: userData } = useGetDocument(usersCol, userDocumentId || "")

	const isAdmin = userData?.admin === true

	// add a new restaurant to db
	const addNewRestaurant = async (data: RestaurantFormData) => {
		try {
			// get geo code for the submitted address
			const res = await getGeocode(data.address, data.city)

			const collecionRef = isAdmin ? newRestaurantCol : restaurantRequestCol

			const docRef = doc(collecionRef)
			await setDoc(docRef, {
				...data,
				geolocation: {
					lat: res.lat,
					lng: res.lng,
				},
			})

			// add new document to `restaurants` collection in db

			// set content of the document
		} catch (err: any) {
			toast.error(err.message)
		}
		toast.success("Form successfully sent. Thank you!")
	}

	return (
		<>
			<AddNewRestaurantForm onAddRestaurant={addNewRestaurant} />
		</>
	)
}

export default AddNewRestaurantPage
