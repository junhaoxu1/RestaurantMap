import { FirebaseError } from 'firebase/app'
import { useRef, useState, useEffect } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from "react-bootstrap/Container"
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { SignUpCreds, UserFormData } from '../types/User.types'
import { doc, setDoc, getDocs } from 'firebase/firestore'
import { usersCol } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'


const SignupPage = () => {
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const {handleSubmit, register, watch,formState: { errors }} = useForm<SignUpCreds>()
    const navigate = useNavigate()

    const { signup, currentUser } = useAuth()

    const passwordRef = useRef("")
    passwordRef.current = watch("password")

	const onAddUser = async (data: UserFormData) => {
		const docRef = doc(usersCol)

		const querySnapshot = await getDocs(usersCol)
		const userCount = querySnapshot.size

		if (userCount === 0) {
			await setDoc(docRef, {
				...data,
				admin: true,
				uid: data.uid
			})
		} else {
			await setDoc(docRef, {
				...data,
				admin: false,
				uid: data.uid
			})
		}
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (!currentUser) {

				return;
			  }
		  if (user) {
			const userData: UserFormData = {
			email: currentUser?.email || '',
			  admin: false,
			  uid: ""
			};
	  
			try {
			  await onAddUser(userData);
			  navigate("/");
			} catch (error) {
			  if (error instanceof FirebaseError) {
				setError(error.message);
			  } else {
				setError("Something Went Wrong");
			  }
			} finally {
			  setLoading(false);
			}
		  }
		});
	  
		return unsubscribe;
	  }, []);

	  const onSignup: SubmitHandler<SignUpCreds> = async (data) => {
		setError(null);
	  
		try {
		  setLoading(true);
		  await signup(data.email, data.password);
	  
		  const currentUser = auth.currentUser; // Get the current user after signup
	  
		  if (currentUser) {
			const userData: UserFormData = {
			  email: currentUser.email || '', // Use the email from currentUser (if available)
			  admin: false,
			  uid: currentUser.uid || '', // Use the UID from currentUser (if available)
			};
	  
			onAddUser(userData);
			navigate("/");
		  } else {
			// Handle the case where currentUser is not available
			setError("User not found after signup.");
		  }
		} catch (error) {
		  if (error instanceof FirebaseError) {
			setError(error.message);
		  } else {
			setError("Something Went Wrong");
		  }
		}
		setLoading(false);
	  };

	return (
		<Container className="py-3 center-y">
			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Body>
							<Card.Title className="mb-3">Sign Up</Card.Title>

							{error && (<Alert variant="danger">{error}</Alert>)}

							<Form onSubmit={handleSubmit(onSignup)}>
								<Form.Group controlId="email">
									<Form.Label>Email</Form.Label>
									<Form.Control
										placeholder="snelhest2000@horsemail.com"
										type="email"
										{...register('email', {
											required: "You have to enter an email",
										})}
									/>
									{errors.email && <p className="invalid">{errors.email.message ?? "Invalid value"}</p>}
								</Form.Group>

								<Form.Group controlId="password">
									<Form.Label>Password</Form.Label>
									<Form.Control
										type="password"
										autoComplete="new-password"
										{...register('password', {
											required: "You're kidding, right? Enter a password, stupid",
											minLength: {
												value: 3,
												message: "Please enter at least 3 characters"
											},
										})}
									/>
									{errors.password && <p className="invalid">{errors.password.message ?? "Invalid value"}</p>}
									<Form.Text>At least 6 characters</Form.Text>
								</Form.Group>

								<Form.Group controlId="confirmPassword">
									<Form.Label>Confirm Password</Form.Label>
									<Form.Control
										type="password"
										autoComplete="off"
										{...register('passwordConfirm', {
											required: "Enter your password again.........",
											minLength: {
												value: 3,
												message: "Please enter at least 3 characters"
											},
											validate: (value) => {
												return value === passwordRef.current || "The passwords does not match 🤦🏼‍♂️"
											}
										})}
									/>
									{errors.passwordConfirm && <p className="invalid">{errors.passwordConfirm.message ?? "Invalid value"}</p>}
								</Form.Group>

								<Button
									disabled={loading}
									variant="primary"
									type="submit"
								>
									{loading
										? "Creating account..."
										: "Create Account"}
								</Button>
							</Form>
						</Card.Body>
					</Card>

					<div className="text-center mt-3">
						Already have an account? <Link to="/login">Log In</Link>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default SignupPage
