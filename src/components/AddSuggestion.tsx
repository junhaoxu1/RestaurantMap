import React, { useState, ChangeEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { restaurantSuggestCol } from '../services/firebase';
import { Restaurant } from '../types/restaurants.types';

const AddSuggestion: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Restaurant>({
    _id: '',
    name: '',
    address: '',
    category: '',
    city: '',
    description: '',
    email: '',
    facebook: '',
    instagram: '',
    phone: '',
    supply: '',
    webpage: '',
    geolocation: {
        lat: 0,
        lng: 0,
    },
    cover_photo: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSuggest = async () => {
    const docRef = doc(restaurantSuggestCol);

    try {
      await setDoc(docRef, formData);
      navigate('/');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <Form>
      <Form.Group>
        <Form.Label>Name:</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Address:</Form.Label>
        <Form.Control
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>City:</Form.Label>
        <Form.Control
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Category:</Form.Label>
        <Form.Control
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Description:</Form.Label>
        <Form.Control
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Facebook:</Form.Label>
        <Form.Control
          type="text"
          name="facebook"
          value={formData.facebook}
          onChange={handleChange}
        /> 
      </Form.Group>

      <Form.Group>
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
        /> 
      </Form.Group>

      <Form.Group>
        <Form.Label>Instagram:</Form.Label>
        <Form.Control
          type="text"
          name="instagram"
          value={formData.instagram}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Phone Number:</Form.Label>
        <Form.Control
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Webpage:</Form.Label>
        <Form.Control
          type="text"
          name="webpage"
          value={formData.webpage}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" onClick={onSuggest}>
        Send
      </Button>
    </Form>
  );
};

export default AddSuggestion;