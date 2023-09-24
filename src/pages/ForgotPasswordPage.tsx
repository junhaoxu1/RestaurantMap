import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from "react-bootstrap/Container"
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { FirebaseError } from 'firebase/app'
import { ForgotUserPasswordData } from '../types/User.types'
import useAuth from '../hooks/useAuth'
import { SubmitHandler, useForm } from 'react-hook-form'


const ForgotPasswordPage = () => {
	const [ errorUserMessage, setErrorUserMessage ] = useState<string | null>(null)
	const [ successUserMessage, setSuccessUserMessage ] = useState<string | null>(null)
	const [ loading, setLoading ] = useState(false)
	const { handleSubmit, register, formState: { errors } } = useForm<ForgotUserPasswordData>()
	const { resetUserPassword } = useAuth()

	const onForgotUserPassword: SubmitHandler<ForgotUserPasswordData> = async (data) => {
		setErrorUserMessage(null)

		try {
			setLoading(true)
			await resetUserPassword(data.email)

			setSuccessUserMessage("Our team have sent you a password reset for your email. Please check your email spam-folder if you have not seen the link in a few minutes ")
			setLoading(false)

		} catch (error) {
			if (error instanceof FirebaseError) {
				setErrorUserMessage(error.message)
			} else {
				setErrorUserMessage("Something went wrong direction")
			}
		}
	}

	return (
		<Container className="py-3 center-y">
			<Row>
				<Col md={{ span: 6, offset: 3}}>
					<Card>
						<Card.Body>
							<Card.Title className="mb-3">Are you sure, you forgot the password?</Card.Title>
							{errorUserMessage && (<Alert variant="danger">{errorUserMessage}</Alert>)}
							{successUserMessage && (<Alert variant="success">{successUserMessage}</Alert>)}

							<p>Enter your email address and we will send you a password reset link</p>

							<Form onSubmit={handleSubmit(onForgotUserPassword)}>
								<Form.Group controlId="email" className="mb-3">
									<Form.Label>Email</Form.Label>
									<Form.Control
										placeholder="youremail@gmail.com"
										type="email"
										{...register('email', {
											required: "You have to enter your email"
										})}
									/>
									{errors.email && <p className="invalid">{errors.email.message ?? "Invalid value"}</p>}
								</Form.Group>

								<Button
									disabled={loading}
									variant="primary"
									type="submit"
								>
									{loading
										? "Sending to your email..."
										: "Send password reset link"}
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default ForgotPasswordPage
