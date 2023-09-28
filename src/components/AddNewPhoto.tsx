import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type AddPhotoProps = {
  onPhotoUpload: (photo: string) => Promise<void>;
};

const AddNewPhoto: React.FC<AddPhotoProps> = ({ onPhotoUpload }) => {
    const [image, setImage] = useState<string | null>(null);
    const navigate = useNavigate()

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setImage(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        if (image) {
            onPhotoUpload(image);
            setImage(null);

            //Timeout to make sure data gets sent to collection
            setTimeout(() => {
                window.location.reload();
              }, 500);
        } else {
            toast.error("Failed To Upload Image! Try again")
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            <Button
                variant='danger'
                onClick={handleUpload}
            >
                Upload
            </Button>
        </div>
    );
};

export default AddNewPhoto;