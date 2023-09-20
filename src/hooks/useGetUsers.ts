import { where } from 'firebase/firestore'
import { usersCol } from '../services/firebase'
import { UserInformation } from '../types/User.types'
import useStreamCollection from './useStreamCollection'

const useGetUsers = (uid = "") => {
	return useStreamCollection<UserInformation>(
		usersCol,
		where("uid", "==", uid),
	)
}

export default useGetUsers
