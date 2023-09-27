import React, { useEffect } from "react"
import Form from "react-bootstrap/Form"
import { useForm, SubmitHandler } from "react-hook-form"
import { RestaurantFormData } from "../types/restaurants.types"
import Button from "react-bootstrap/Button"

type Props = {
	onAddRestaurant: (data: RestaurantFormData) => Promise<void>
	currentRestaurant: RestaurantFormData
    onDeleteImage: (index: number) => Promise<void>
}

const AddNewRestaurantForm: React.FC<Props> = ({ onAddRestaurant, currentRestaurant, onDeleteImage }) => {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitSuccessful },
		reset,
	} = useForm<RestaurantFormData>()

	const onFormSubmit: SubmitHandler<RestaurantFormData> = async (data: RestaurantFormData) => {
		// passing `data` to parent
		await onAddRestaurant({
			...data,
		})
	}

	// reset form upon mount/reset and successful submit
	useEffect(() => {
		reset()
	}, [isSubmitSuccessful, reset])
	return (
		<Form onSubmit={handleSubmit(onFormSubmit)} className="form-container">
			<p className="h2 text-center">Edit Restaurant</p>
			<div className="line"></div>
			<div className="flex-wrapper d-flex justify-content-evenly">
				<div className="form-wrapper">
					<Form.Group className="mt-3">
						<Form.Label>Restaurant's name</Form.Label>
						<Form.Control
							defaultValue={currentRestaurant.name}
							type="text"
							className="form-control"
							aria-label="The restaurant's name"
							{...register("name", {
								required: "Please enter the name of the restaurant...",
								minLength: {
									value: 3,
									message: "Restaurants name has to be at least 3 characters...",
								},
							})}
						/>
						{errors.name && <p className="input-error">{errors.name.message ?? "Invalid value"}</p>}
					</Form.Group>

					<Form.Group className="mt-3">
						<Form.Label>Address</Form.Label>
						<Form.Control
							defaultValue={currentRestaurant.address}
							type="text"
							className="form-control"
							aria-label="The restaurant's address"
							{...register("address", {
								required: "Please enter the address to the restaurant...",
								minLength: {
									value: 5,
									message: "Address has to be at least 5 characters long",
								},
							})}
						/>
						{errors.address && <p className="input-error">{errors.address.message ?? "Invalid value"}</p>}
					</Form.Group>

					<Form.Group className="mt-3">
						<Form.Label>City</Form.Label>
						<Form.Control
							defaultValue={currentRestaurant.city}
							type="text"
							className="form-control"
							aria-label="City where restaurant is located"
							{...register("city", {
								required: "Please enter the city where the restaurant is located...",
								minLength: {
									value: 3,
									message: "City has to be at least 3 characters long",
								},
							})}
						/>
						{errors.city && <p className="input-error">{errors.city.message ?? "Invalid value"}</p>}
					</Form.Group>

					<Form.Group className="mt-3">
						<Form.Label>Description</Form.Label>
						<Form.Control
							as="textarea"
							defaultValue={currentRestaurant.description}
							rows={3}
							className="form-control"
							aria-label="Descriptiton of the restaurant"
							{...register("description", {
								required: "Please enter a short description for the restaurant...",
								minLength: {
									value: 5,
									message: "Description has to be at least 5 characters long",
								},
								maxLength: {
									value: 200,
									message: "Description has to be less than 200 characters",
								},
							})}
						/>
						{errors.description && <p className="input-error">{errors.description.message ?? "Invalid value"}</p>}
					</Form.Group>
					<Form.Group className="mt-3">
						<Form.Label>Categories</Form.Label>
						<Form.Select
							defaultValue={currentRestaurant.category}
							aria-label="Select categories"
							required
							{...register("category", {
								required: "Please select an option",
							})}
						>
							<option value="" hidden>
								Select an option
							</option>
							<option value="café">Café</option>
							<option value="restaurant">Restaurant</option>
							<option value="fast_food">Fast Food</option>
							<option value="kioskGrill">Kiosk/Grill</option>
							<option value="foodtruck">Foodtruck</option>
						</Form.Select>
						{errors.category && <p className="input-error">{errors.category.message ?? "Invalid value"}</p>}
					</Form.Group>

					<Form.Group className="mt-3">
						<Form.Label>Supply</Form.Label>
						<Form.Select
							defaultValue={currentRestaurant.supply}
							aria-label="Select Supply"
							{...register("supply", {
								required: "Please select an option",
							})}
						>
							<option value="" hidden>
								Select an option
							</option>
							<option value="lunch">Lunch</option>
							<option value="afterWork">After Work</option>
							<option value="dinner">Dinner / Á la carte</option>
						</Form.Select>
						{errors.supply && <p className="input-error">{errors.supply.message ?? "Invalid value"}</p>}
					</Form.Group>
				</div>

				<div className="form-wrapper">
					<Form.Group className="mt-3">
						<Form.Label>
							Email <span className="text-muted">(optional)</span>
						</Form.Label>
						<Form.Control
							type="text"
							className="form-control"
							aria-label="Email to the restaurant"
							{...register("email")}
							defaultValue={currentRestaurant.email}
							placeholder="Add Email"
						/>
					</Form.Group>
					<Form.Group className="mt-3">
						<Form.Label>
							Phone <span className="text-muted">(optional)</span>
						</Form.Label>
						<Form.Control
							type="text"
							className="form-control"
							aria-label="Phone to the restaurant"
							{...register("phone")}
							defaultValue={currentRestaurant.phone}
							placeholder="Add Phone"
						/>
					</Form.Group>

					<Form.Group className="mt-3">
						<Form.Label>
							Website <span className="text-muted">(optional)</span>
						</Form.Label>
						<Form.Control
							type="text"
							className="form-control"
							aria-label="Webpage address"
							{...register("webpage")}
							defaultValue={currentRestaurant.webpage}
							placeholder="Add Website"
						/>
					</Form.Group>

					<Form.Group className="mt-3">
						<Form.Label>
							Facebook <span className="text-muted">(optional)</span>
						</Form.Label>
						<Form.Control
							type="text"
							className="form-control"
							aria-label="Facebook"
							{...register("facebook")}
							defaultValue={currentRestaurant.facebook}
							placeholder="Add Facebook"
						/>
					</Form.Group>

					<Form.Group className="mt-3">
						<Form.Label>
							Instagram <span className="text-muted">(optional)</span>
						</Form.Label>
						<Form.Control
							type="text"
							className="form-control"
							aria-label="Instagram"
							{...register("instagram")}
							defaultValue={currentRestaurant.instagram}
							placeholder="Add Instagram"
						/>
					</Form.Group>
					<Form.Group className="mt-3">
						<Form.Label>
							Photos <span className="text-muted" />
						</Form.Label>
						{currentRestaurant.user_photos && currentRestaurant.user_photos.length > 0 ? (
							currentRestaurant.user_photos.map((photo, index) => (
								<div key={index} className="mb-2">
									<img src={photo.photo} style={{ width: "100px", height: "auto" }} />
                                    <Button onClick={() => onDeleteImage(index)}>Delete</Button>
								</div>
							))
						) : (
							<p>No photos available</p>
						)}
					</Form.Group>
					<Button type="submit" className="mt-3 w-100" style={{ backgroundColor: "crimson", border: "none" }}>
						Save
					</Button>
				</div>
			</div>
		</Form>
	)
}

export default AddNewRestaurantForm
