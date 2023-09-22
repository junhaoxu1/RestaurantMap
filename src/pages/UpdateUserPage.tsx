import { FirebaseError } from "firebase/app"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { useRef, useState } from "react"
import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Image from "react-bootstrap/Image"
import Row from "react-bootstrap/Row"
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify"
import useAuth from "../hooks/useAuth"
import { storage, usersCol } from "../services/firebase"
import { UpdateUserFormData } from "../types/User.types"
import { getDocs, doc, setDoc } from "firebase/firestore"


const UpdateUserPage = () => {
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const { currentUser, reloadUser, setDisplayName, setEmail, setPassword, setPhotoUrl, userPhotoUrl } = useAuth()
	const {
		handleSubmit,
		register,
		watch,
		formState: { errors },
	} = useForm<UpdateUserFormData>({
		defaultValues: {
			email: currentUser?.email ?? "",
			name: currentUser?.displayName ?? "",
		},
	})

	const passwordRef = useRef("")
	passwordRef.current = watch("password")

	const photoFileRef = useRef<FileList | null>(null)
	photoFileRef.current = watch("photoFile")

	if (!currentUser) {
		return <p>Failed</p>
	}

	const onUpdateProfile: SubmitHandler<UpdateUserFormData> = async (data) => {
		setError(null)
		const docRef = doc(usersCol)

		const querySnapshot = await getDocs(usersCol)

		// await setDoc(docRef, {
		// 	...data,
		// 	name: data.name,
		// 	email: data.email,
		// 	photo
		// })

		try {
			setLoading(true)

			if (data.name !== (currentUser.displayName ?? "")) {
				await setDisplayName(data.name)
			}

			if (data.email !== (currentUser.email ?? "")) {
				await setEmail(data.email)
			}

			if (data.password) {
				await setPassword(data.password)
			}

			if (data.photoFile.length) {
				const photo = data.photoFile[0]

				const fileRef = ref(storage, `photos/${currentUser.uid}/${photo.name}`)

				const uploadTask = uploadBytesResumable(fileRef, photo)

				uploadTask.on(
					"state_changed",
					(snapshot) => {
						Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 1000) / 10
					},
					(err) => {
						setError("Upload failed: " + err)
					},
					async () => {
						const photoUrl = await getDownloadURL(fileRef)

						await setPhotoUrl(photoUrl)
					}
				)
			}

			await reloadUser()

			setLoading(false)
		} catch (error) {
			if (error instanceof FirebaseError) {
				setError(error.message)
			} else {
				setError("Failed")
			}
		}
	}

  const handleDeletePhoto = async () => {
    await setPhotoUrl("")

    await reloadUser()

    toast.success("Photo deleted")
  }

	return (
		<Container>
			<Row>
				<Col>
					<Card>
						<Card.Title>Update Profile</Card.Title>

            {error && (<Alert variant="danger">{error}</Alert>)}

						<Form onSubmit={handleSubmit(onUpdateProfile)}>

							<div className="profile-photo-wrapper text-center my-3">
								<div className="d-flex justify-content-center mb-2">
									<Image 
                    src={userPhotoUrl || "https://via.placeholder.com/225"} 
                    fluid 
                    rounded
                    className="img-square w-50" 
                  />
								</div>
                <Button
                  onClick={handleDeletePhoto}
                  variant="danger"
                >
                  Delete Photo
                </Button>
							</div>

              <Form.Group controlId="photo" className="mb-3">
									<Form.Label>Photo</Form.Label>
									<Form.Control
										type="file"
										accept="image/gif,image/jpeg,image/png,image/webp"
										{...register('photoFile')}
									/>
									{errors.photoFile && <p className="invalid">{errors.photoFile.message ?? "Invalid value"}</p>}
                  <Form.Text>
                    {photoFileRef.current && photoFileRef.current.length > 0 && (
                      <span>
                        {photoFileRef.current[0].name}
                        {' '}
                        ({Math.round(photoFileRef.current[0].size / 1024)} kb)
                      </span>
                    )}
                </Form.Text>
								</Form.Group>

              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  placeholder={currentUser.displayName || ""}
                  type="text"
                  {...register('name')}
                />
                {errors.name && <p className="invalid">{errors.name.message ?? "Invalid value"}</p>}
              </Form.Group>

              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  placeholder={currentUser.email || ""}
                  type="email"
                  {...register('email', {
                    required: "Enter an email"
                  })}
                />
                {errors.email && <p className="invalid">{errors.email.message ?? "Invalid value"}</p>}
              </Form.Group>

              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password"
                  autoComplete="new-password"
                  {...register('password', {
                    minLength: {
                      value: 3,
                      message: "Enter at least 3 characters"
                    }
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
										{...register('passwordConfirm', {
											minLength: {
												value: 3,
												message: "Enter at least 3 characters"
											},
											validate: (value) => {
												return !passwordRef.current || value === passwordRef.current || "The passwords does not match"
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
                {loading ? "Updating..." : "Save"}
              </Button>
						</Form>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default UpdateUserPage
