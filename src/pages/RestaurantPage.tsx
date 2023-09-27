import useGetDocument from "../hooks/useGetDocument"
import { Restaurant } from "../types/restaurants.types"
import { photoRequestCol, newRestaurantCol, usersCol, db } from "../services/firebase"
import { useParams } from "react-router-dom"
import RestaurantDetails from "../components/RestaurantDetails"
import AddNewPhoto from "../components/AddNewPhoto"
import { setDoc, doc, collection, getDocs, query, where, updateDoc } from "firebase/firestore"
import { useState, useEffect } from "react"
import useAuth from "../hooks/useAuth"

const RestaurantPage = () => {
    const { currentUser } = useAuth()
    const { id } = useParams();

    const documentId = String(id);

    if (!documentId) return <p>Restaurant doesn't exist</p>;

    const [userDocumentId, setUserDocumentId] = useState<string | null>(null); 

    const { data: restaurant, loading } = useGetDocument<Restaurant>(newRestaurantCol, documentId);
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
                        photo: photoUrl,
                    },
                ],
            };
    
            try {
                if(isAdmin) {
                    const docRef = doc(newRestaurantCol, documentId)
                    await updateDoc(docRef, updatedRestaurant)
                } else {
                    const docRef = doc(photoRequestCol, documentId)
                    await setDoc(docRef, updatedRestaurant)
                }
            } catch (error) {
                console.error("Error updating restaurant document:", error);
            }
        }
    };

    if (!restaurant || loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <RestaurantDetails restaurant={restaurant} />
            <AddNewPhoto onPhotoUpload={handleUpload} />
        </>
    );
}

export default RestaurantPage;