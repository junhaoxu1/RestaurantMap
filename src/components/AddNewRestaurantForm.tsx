import React, { useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import { useForm, SubmitHandler } from 'react-hook-form'
import { RestaurantFormData } from '../types/restaurants.types'
import Button from 'react-bootstrap/Button'

type Props = {
    onAddRestaurant: (data: RestaurantFormData) => Promise<void>
}

const AddNewRestaurantForm: React.FC<Props> = ({ onAddRestaurant }) => {
    const { handleSubmit, register, formState: { errors, isSubmitSuccessful }, reset } = useForm<RestaurantFormData>()
    
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
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            
            <Form.Group className='mt-3'>
                <Form.Label>
                    Restaurant's name
                </Form.Label>
                <Form.Control
                        type="text"
                        className="form-control"
                        aria-label="The restaurant's name"
                        {...register('name', {
                            required: "Please enter the name of the restaurant...",
                            minLength: {
                                value: 3,
                                message: "Restaurants name has to be at least 3 characters..."
                            },
                        })}
                    />
            </Form.Group>

            <Form.Group className='mt-3'>
                <Form.Label>
                    Address
                </Form.Label>
                <Form.Control
                        type="text"
                        className="form-control"
                        aria-label="The restaurant's address"
                        {...register('address', {
                            required: "Please enter the address to the restaurant...",
                            minLength: {
                                value: 5,
                                message: "Address has to be at least 5 characters long"
                            },
                        })}
                    />
            </Form.Group>

            <Form.Group className='mt-3'>
                <Form.Label>
                    City
                </Form.Label>
                <Form.Control
                        type="text"
                        className="form-control"
                        aria-label="City where restaurant is located"
                        {...register('city', {
                            required: "Please enter the city where the restaurant is located...",
                            minLength: {
                                value: 3,
                                message: "City has to be at least 3 characters long"
                            },
                        })}
                    />
            </Form.Group>

            <Form.Group className='mt-3'>
                <Form.Label>
                    Description
                </Form.Label>
                <Form.Control
                        type="text"
                        className="form-control"
                        aria-label="Descriptiton of the restaurant"
                        {...register('description', {
                            required: "Please enter a short description for the restaurant...",
                            minLength: {
                                value: 5,
                                message: "Description has to be at least 5 characters long"
                            },
                        })}
                    />
            </Form.Group>

            <Form.Group className='mt-3'>
                <Form.Label>
                    Categories
                </Form.Label>
                <Form.Select 
                    aria-label='Select categories' 
                    required 
                    {...register("category", {
                        required: "Please select an option"
                    })}
                >
                    <option>Please select category</option>
                    <option value="café">Café</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="fast_food">Fast Food</option>
                    <option value="kioskGrill">Kiosk/Grill</option>
                    <option value="foodtruck">Foodtruck</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className='mt-3'>
                <Form.Label>
                    Supply
                </Form.Label>
                <Form.Select 
                    aria-label='Select Supply' 
                    {...register("supply", {
                        required: "Please select an option"
                    })}
                >
                    <option>Please select supply</option>
                    <option value="lunch">Lunch</option>
                    <option value="afterWork">After Work</option>
                    <option value="dinner">Dinner / Á la carte</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className='mt-3'>
                <Form.Label>
                    Email <span className='text-muted'>(optional)</span>
                </Form.Label>
                <Form.Control
                        type="text"
                        className="form-control"
                        aria-label="Email to the restaurant"
                        {...register("email")}
                />
            </Form.Group>
            <Form.Group className='mt-3'>
                <Form.Label>
                    Phone <span className='text-muted'>(optional)</span>
                </Form.Label>
                <Form.Control
                        type="text"
                        className="form-control"
                        aria-label="Phone to the restaurant"
                        {...register("phone")}
                />
            </Form.Group>

            <Form.Group className='mt-3'>
                <Form.Label>
                    Website <span className='text-muted'>(optional)</span>
                </Form.Label>
                <Form.Control
                        type="text"
                        className="form-control"
                        aria-label="Webpage address"
                        {...register("webpage")}
                />
            </Form.Group>

            <Form.Group className='mt-3'>
                <Form.Label>
                    Facebook <span className='text-muted'>(optional)</span>
                </Form.Label>
                <Form.Control
                        type="text"
                        className="form-control"
                        aria-label="Facebook"
                        {...register("facebook")}
                />
            </Form.Group>

            <Form.Group className='mt-3'>
                <Form.Label>
                    Instagram <span className='text-muted'>(optional)</span>
                </Form.Label>
                <Form.Control
                        type="text"
                        className="form-control"
                        aria-label="Instagram"
                        {...register("instagram")}
                />
            </Form.Group>

            <Button 
                type='submit'
                className='mt-3'
            >Send Recommendation</Button>

            {/* Display error message if form fails to submit */}
            {errors.name && <p>{errors.name.message ?? "Invalid value"}</p>}
            {errors.address && <p>{errors.address.message ?? "Invalid value"}</p>}
            {errors.city && <p>{errors.city.message ?? "Invalid value"}</p>}
            {errors.description && <p>{errors.description.message ?? "Invalid value"}</p>}
            {errors.category && <p>{errors.category.message ?? "Invalid value"}</p>}
            {errors.supply && <p>{errors.supply.message ?? "Invalid value"}</p>}
        </Form>
    )
}

export default AddNewRestaurantForm