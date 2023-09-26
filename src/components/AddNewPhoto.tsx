import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'

type AddPhotoProps = {
  onPhotoUpload: (photo: string) => Promise<void>;
};

const AddNewPhoto: React.FC<AddPhotoProps> = ({ onPhotoUpload }) => {
    const [image, setImage] = useState("");

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
            setImage('');
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