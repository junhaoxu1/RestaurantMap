import React from "react"
import Image from "react-bootstrap/Image"
import { Restaurant } from "../types/restaurants.types"
import Card from "react-bootstrap/Card"
import { FaFacebook, FaInstagram } from "react-icons/fa"
import { Container } from "react-bootstrap"
import AddNewPhoto from "./AddNewPhoto"
import { photoRequestCol, newRestaurantCol, usersCol, db } from "../services/firebase"
import { setDoc, doc, collection, getDocs, query, where, updateDoc } from "firebase/firestore"
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'
import useAuth from "../hooks/useAuth"
import { toast } from 'react-toastify'
import { useParams } from "react-router-dom"
import useGetDocument from "../hooks/useGetDocument"


type Props = {
	restaurant: Restaurant
}

const RestaurantDetails: React.FC<Props> = ({ restaurant }) => {
	const { id } = useParams();
    const documentId = String(id);
	const { currentUser } = useAuth()
    const uuid = uuidv4()

    if (!documentId) return <p>Restaurant doesn't exist</p>;

    const [userDocumentId, setUserDocumentId] = useState<string | null>(null); 
    const { data: userData } = useGetDocument(usersCol, userDocumentId || '');

    const isAdmin = userData?.admin === true;

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                try {
                    const usersCollection = collection(db, "users");
                    const checkId = query(usersCollection, where("uid", "==", currentUser.uid));
                    const querySnapshot = await getDocs(checkId);
                    
                    if (querySnapshot.size === 1) {
                        const userDoc = querySnapshot.docs[0];
                        setUserDocumentId(userDoc.id);
                    } else {
                        console.error("User document not found.");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };
        fetchData();
    }, [currentUser]);

    const handleUpload = async (photoUrl: string) => {
        if (restaurant && photoUrl) {
            const updatedRestaurant = {
                ...restaurant,
                user_photos: [
                    ...(restaurant.user_photos || []),
                    {
                        id: uuid,
                        photo: photoUrl,
                    },
                ],
            };
    
            try {
                if(isAdmin) {
                    const docRef = doc(newRestaurantCol, documentId)
                    toast.success("Image Uploaded")
                    await updateDoc(docRef, updatedRestaurant)
                } else {
                    const docRef = doc(photoRequestCol, documentId)
                    toast.success("Upload Request Sent")
                    await setDoc(docRef, updatedRestaurant)
                }
            } catch (error) {
                console.error("Error updating restaurant document:", error);
            }
        }
    };
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
							<Card className="card-text mt-3">
								<div className="image-gallery">
									{restaurant.user_photos?.map((photo, index) => (
										<Image
											key={index}
											src={photo.photo}
											style={{ width: "100%", objectFit: "cover" }}
										/>
									))}
								</div>
								<AddNewPhoto onPhotoUpload={handleUpload}/>
							</Card>
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
							<div className="card-text mt-3">
								<span className="details-subheading">Website:</span> <br />{" "}
								<a href={`https://${restaurant.webpage}`} target="_blank">
									{restaurant.webpage || "N/A"}
								</a>
							</div>
							<div className="card-text mt-3">
								<span className="details-subheading">Social Media:</span> <br />
								<span className="social-media-container d-flex gap-2">
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
								</span>
							</div>
						</Card.Body>
					</Card>
				</div>
			</Container>
		</>
	)
}

export default RestaurantDetails
