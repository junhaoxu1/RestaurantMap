/* eslint-disable @typescript-eslint/no-empty-function */
import {
	UserCredential,
	createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
	onAuthStateChanged,
    updateEmail,
    updatePassword,
    updateProfile,
	User,
    signOut,
} from 'firebase/auth'
import { createContext, useEffect, useState } from 'react'
import SyncLoader from 'react-spinners/SyncLoader'
import { auth } from '../services/firebase'

type AuthContextType = {
	currentUser: User | null
	signup: (email: string, password: string) => Promise<UserCredential>
    login: (email: string, password: string) => Promise<UserCredential>
    logout: () => Promise<void>
    reloadUser: () => Promise<boolean>
    setEmail: (email: string) => Promise<void>
	setDisplayName: (displayName: string) => Promise<void>
	setPassword: (password: string) => Promise<void>
	setPhotoUrl: (photoURL: string) => Promise<void>
	userEmail: string | null
	userName: string | null
    userPhotoUrl: string | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

type AuthContextProps = {
	children: React.ReactNode
}

const AuthContextProvider: React.FC<AuthContextProps> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [userEmail, setUserEmail] = useState<string | null>(null)
	const [userName, setUserName] = useState<string | null>(null)
    const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null)

	const signup = (email: string, password: string) => {
		return createUserWithEmailAndPassword(auth, email, password)
	}

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        return signOut(auth)
    }

    const setEmail = (email: string) => {
        if (!currentUser) { throw new Error("User is null")}
        return updateEmail(currentUser, email)
    }

    const setDisplayName = (displayName: string) => {
        if (!currentUser) { throw new Error("User is null")}
        return updateProfile(currentUser, { displayName })
    }

    const setPassword = (password: string) => {
        if (!currentUser) { throw new Error("User is null")}
        return updatePassword(currentUser, password)
    }

    const setPhotoUrl = (photoURL: string) => {
        if (!currentUser) { throw new Error("User is null")}
        setUserPhotoUrl(photoURL)
        return updateProfile(currentUser, { photoURL })
    }

    const reloadUser = async () => {
		if (!auth.currentUser) {
			return false
		}
		setUserEmail(auth.currentUser.email)
        setUserName(auth.currentUser.displayName)
        setUserPhotoUrl(auth.currentUser.photoURL)

		return true
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user)

			if (user) {
				setUserEmail(user.email)
				setUserName(user.displayName)
                setUserPhotoUrl(user.photoURL)
			} else {
				setUserEmail(null)
				setUserName(null)
                setUserPhotoUrl(null)
			}
			setLoading(false)
		})

		return unsubscribe
	}, [])

	return (
		<AuthContext.Provider value={{
			currentUser,
			signup,
            login,
            logout,
            reloadUser,
            setDisplayName,
            setEmail,
            setPassword,
            setPhotoUrl,
			userEmail,
			userName,
            userPhotoUrl
		}}>
			{loading ? (
				<div id="initial-loader">
					<SyncLoader color={'#888'} size={15} speedMultiplier={1.1} />
				</div>
			) : (
				<>{children}</>
			)}
		</AuthContext.Provider>
	)
}

export default AuthContextProvider
