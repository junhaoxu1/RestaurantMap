import { FirebaseError } from 'firebase/app'
import { useState } from 'react'
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
import { LoginCreds } from '../types/User.types'

const LoginPage = () => {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const { handleSubmit, register, formState: { errors } } = useForm<LoginCreds>()
    const { login } = useAuth()
	const navigate = useNavigate()

    const onLogin: SubmitHandler<LoginCreds> = async (data) => {
        setError(null)

        try {
            setLoading(true)
            await login(data.email, data.password)

			navigate("/")
        } catch (error) {
            if(error instanceof FirebaseError) {
                setError(error.message)
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
							<Card.Title className="mb-3">Login</Card.Title>

							{error && (<Alert variant="danger">{error}</Alert>)}

							<Form onSubmit={handleSubmit(onLogin)}>
								<Form.Group controlId="email" className="mb-3">
									<Form.Label>Email</Form.Label>
									<Form.Control
										placeholder="abc@gmail.com"
										type="email"
										{...register('email', {
											required: "You have to enter your email",
										})}
									/>
									{errors.email && <p className="invalid">{errors.email.message ?? "Invalid value"}</p>}
								</Form.Group>

								<Form.Group controlId="password" className="mb-3">
									<Form.Label>Password</Form.Label>
									<Form.Control
										type="password"
										autoComplete="new-password"
										{...register('password', {
											required: "Enter Password",
										})}
									/>
									{errors.password && <p className="invalid">{errors.password.message ?? "Invalid value"}</p>}
								</Form.Group>

								<Button
									disabled={loading}
									variant="primary"
									type="submit"
								>
									{loading
										? "Logging in..."
										: "Log In"}
								</Button>
							</Form>

							<div className="text-center">
								<Link to="/forgot-password">Forgot Password?</Link>
							</div>
						</Card.Body>
					</Card>

					<div className="text-center mt-3">
						Need an account? <Link to="/signup">Sign Up</Link>
					</div>
				</Col>
			</Row>
		</Container>
  )
}

export default LoginPage