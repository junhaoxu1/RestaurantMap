import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import NavDropdown from "react-bootstrap/NavDropdown"
import Nav from "react-bootstrap/Nav"
import { NavLink, Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import Image from "react-bootstrap/Image"

const Navigation = () => {
	const { currentUser, userEmail, userName, userPhotoUrl } = useAuth()

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
								<NavDropdown
									title={
										userPhotoUrl ? (
											<Image
												src={userPhotoUrl}
												height={30}
												width={30}
												title={(userName || userEmail) ?? ""}
												className="img-square"
												fluid
												roundedCircle
											/>
										) : (
											userName || userEmail
										)
									}
								>
									<NavDropdown.Item as={NavLink} to="/admin">
										Admin
									</NavDropdown.Item>
									<NavDropdown.Item as={NavLink} to="/admin-restaurants">
										Firebase Restaurants data
									</NavDropdown.Item>
									<NavDropdown.Item as={NavLink} to="/users-request">
										Restaurant Request
									</NavDropdown.Item>
									<NavDropdown.Item as={NavLink} to="/photos-request">
										Photos Request
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
