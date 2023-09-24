import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import NavDropdown from "react-bootstrap/NavDropdown"
import Nav from "react-bootstrap/Nav"
import { NavLink, Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import useGetCollection from "../../hooks/useGetCollection"
import { UserFormData } from "../../types/User.types"
import { usersCol } from "../../services/firebase"

const Navigation = () => {
	const { currentUser, userEmail, userName } = useAuth()
	const { data: users, loading } = useGetCollection<UserFormData>(usersCol)

	const admins = users?.filter((user) => user.admin === true)


	return (
		<Navbar>
			<Container>
				<Navbar.Brand as={Link} to="/">
					Restaurant Map🗺️
				</Navbar.Brand>

				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto">
						{currentUser ? (
							<>
								<Nav.Link as={NavLink} end to="/restaurants">
                            		All Restaurants
                        		</Nav.Link>
								<NavDropdown title={(userName || userEmail) ?? ""}>
									<NavDropdown.Item as={NavLink} to="/admin">
										Admin
									</NavDropdown.Item>
									<NavDropdown.Item as={NavLink} to="/users-request">
										Restaurant Request
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item as={NavLink} to="/update-user">
										Update Profile
									</NavDropdown.Item>
									<NavDropdown.Item as={NavLink} to="/logout">
										Logout
									</NavDropdown.Item>
								</NavDropdown>
							</>
						) : (
							<>
								<Nav.Link as={NavLink} end to="/login">
									Login
								</Nav.Link>
								<Nav.Link as={NavLink} end to="/signup">
									Signup
								</Nav.Link>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default Navigation

