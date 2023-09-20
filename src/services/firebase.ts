import { initializeApp } from "firebase/app"
import { CollectionReference, DocumentData, collection, getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { Restaurant, RestaurantFormData } from "../types/restaurants.types"
import { getStorage } from "firebase/storage"
import { UserInformation } from "../types/User.types"

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig)

// Get Firestore Instance
export const db = getFirestore(app)

export const auth = getAuth(app)

export const storage = getStorage(app)

// returns collection with specified type
const createCollection = <T = DocumentData>(collectionName: string) => {
    return collection(db, collectionName) as CollectionReference<T>
}

// collection references for getting the `restaurants` collection in db and setting new document
export const restaurantsCol = createCollection<Restaurant>("restaurants")
export const newRestaurantCol = createCollection<RestaurantFormData>("restaurants")

export const usersCol = createCollection<UserInformation>("users")

export default app

