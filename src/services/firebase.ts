import { initializeApp } from "firebase/app"
import { CollectionReference, DocumentData, collection, getFirestore } from "firebase/firestore"
import { Restaurant } from "../types/restaurants.types"
import { getAuth } from "firebase/auth"

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

// returns collection with specified type
const createCollection = <T = DocumentData>(collectionName: string) => {
    return collection(db, collectionName) as CollectionReference<T>
}

// collection reference for getting the `restaurants` collection in db
export const restaurantsCol = createCollection<Restaurant>("restaurants")

export default app
