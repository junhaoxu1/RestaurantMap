import React, { useState, ChangeEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { restaurantSuggestCol } from '../services/firebase';
import { Restaurant } from '../types/restaurants.types';
import AddSuggestion from '../components/AddSuggestion';

const RestaurantSuggestion: React.FC = () => {
 

  return (
    <>
    
    <AddSuggestion />

    </>
  );
};

export default RestaurantSuggestion;