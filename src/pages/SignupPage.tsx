import { useRef, useState } from "react"
import { FirebaseError } from "firebase/app"
import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import { useForm, SubmitHandler } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { SignUpCreds } from "../types/User.types"

const SignupPage = () => {
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const {
		handleSubmit,
		register,
		watch,
		formState: { errors },
	} = useForm<SignUpCreds>()
    const navigate = useNavigate()

	const { signup } = useAuth()

	const passwordRef = useRef("")
	passwordRef.current = watch("password")

	const onSignup: SubmitHandler<SignUpCreds> = async (data) => {
		setError(null)

		try {
			setLoading(true)
			await signup(data.email, data.password)

            navigate("/login")
		} catch (error) {
			if (error instanceof FirebaseError) {
				setError(error.message)
			} else {
				setError("Something Went Wrong")
			}
		}
		setLoading(false)
	}

	return (
		<Container className="py-3 center-y">
			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Body>
							<Card.Title className="mb-3">Sign Up</Card.Title>

							{error && <Alert variant="danger">{error}</Alert>}

							<Form onSubmit={handleSubmit(onSignup)}>
								<Form.Group controlId="email" className="mb-3">
									<Form.Label>Email</Form.Label>
									<Form.Control
										placeholder="abc@gmail.com"
										type="email"
										{...register("email", {
											required: "You have to enter an email",
										})}
									/>
									{errors.email && <p className="invalid">{errors.email.message ?? "Invalid value"}</p>}
								</Form.Group>

								<Form.Group controlId="password" className="mb-3">
									<Form.Label>Password</Form.Label>
									<Form.Control
										type="password"
										autoComplete="new-password"
										{...register("password", {
											required: "Enter a password",
										})}
									/>
									{errors.password && <p className="invalid">{errors.password.message ?? "Invalid value"}</p>}
									<Form.Text>At least 6 characters</Form.Text>
								</Form.Group>

								<Form.Group controlId="confirmPassword" className="mb-3">
									<Form.Label>Confirm Password</Form.Label>
									<Form.Control
										type="password"
										autoComplete="off"
										{...register("passwordConfirm", {
											required: "Please enter your password",
											validate: (value) => {
												return value === passwordRef.current || "The passwords does not match 🤦🏼‍♂️"
											},
										})}
									/>
									{errors.passwordConfirm && <p className="invalid">{errors.passwordConfirm.message ?? "Invalid value"}</p>}
								</Form.Group>

								<Button disabled={loading} variant="primary" type="submit">
									{loading ? "Creating account..." : "Create Account"}
								</Button>
							</Form>
						</Card.Body>
					</Card>

					<div className="text-center mt-3">
						Already have an account? <Link to="/">Log In</Link>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default SignupPage
