import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import NavDropdown from "react-bootstrap/NavDropdown"
import Nav from "react-bootstrap/Nav"
import { NavLink, Link } from "react-router-dom"

const Navigation = () => {
    return (
        <Navbar>
            <Container>
                <Navbar.Brand style={{ fontSize: "16px" }} as={Link} to="/">
                    Restaurant Map🗺️
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <NavDropdown title="User">
                            <NavDropdown.Item as={NavLink} to="/update">
                                Update Profile
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={NavLink} to="/logout">
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link as={NavLink} end to="/login">
                            Login
                        </Nav.Link>
                        <Nav.Link as={NavLink} end to="/signup">
                            Signup
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation
