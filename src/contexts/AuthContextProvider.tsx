/* eslint-disable @typescript-eslint/no-empty-function */
import {
	UserCredential,
	createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
	onAuthStateChanged,
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
	userEmail: string | null
	userName: string | null
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

	const signup = (email: string, password: string) => {
		return createUserWithEmailAndPassword(auth, email, password)
	}

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        return signOut(auth)
    }

    const reloadUser = async () => {
		if (!auth.currentUser) {
			return false
		}
		setUserEmail(auth.currentUser.email)

		return true
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user)

			if (user) {
				setUserEmail(user.email)
				setUserName(user.displayName)
			} else {
				setUserEmail(null)
				setUserName(null)
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
			userEmail,
			userName,
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