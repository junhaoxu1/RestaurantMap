import Container from "react-bootstrap/Container"
import ListGroup from "react-bootstrap/ListGroup"
import { usersCol } from "../services/firebase"
import { UserFormData } from "../types/User.types"
import useAuth from "../hooks/useAuth"
import useGetCollection from "../hooks/useGetCollection"
import { Link } from "react-router-dom"

const AdminPage = () => {
	const { data: users, loading } = useGetCollection<UserFormData>(usersCol)
	const { currentUser } = useAuth()

	const admins = users?.filter((user) => user.admin === true)
	const sortByAdmin = (a: UserFormData, b: UserFormData) => (a.admin === b.admin ? 0 : a.admin ? -1 : 1)

	return (
		<Container className="py-3">
			{loading ? (
				<p>Loading...</p>
			) : users && currentUser ? (
				admins?.some((admin) => admin.email === currentUser.email) ? (
					<ListGroup className="userlist">
						{users.sort(sortByAdmin).map((user) => (
								<ListGroup.Item 
                                key={user.uid} 
                                as={Link} 
                                to={`/admin/${user.uid}`}
                                >
									<p>Email: {user.email}</p>
                                    <p>Role: {user.admin ? "Admin" : "Visitor"}</p>
								</ListGroup.Item>
						))}
					</ListGroup>
				) : (
					<p>You do not have permission to view this page.</p>
				)
			) : (
				<p>Loading...</p>
			)}
		</Container>
	)
}

export default AdminPage
