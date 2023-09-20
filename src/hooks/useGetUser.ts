import { usersCol } from '../services/firebase'
import { UserInformation } from '../types/User.types'
import useStreamDocument from './useStreamDocument'

const useGetTodo = (documentId: string) => {
	return useStreamDocument<UserInformation>(usersCol, documentId)
}

export default useGetTodo
