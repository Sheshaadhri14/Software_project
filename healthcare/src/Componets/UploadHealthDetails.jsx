import React, { useState } from 'react';
import axios from 'axios';
const UploadHealthDetails = () => {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        location: '',
        bloodGroup: '',
        smoker: '',
        drinker: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'fullBodyReport') {
            setFile(e.target.files[0]);
        } else {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = async (event) => {
          withCredentials: true,
  event.preventDefault();
        const data = new FormData();
        data.append('fullBodyReport', file);
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        try {
            const response = await axios.post('http://localhost:3000/auth/upload-health-details', data, {
                headers: {
                    'Authorization': `Bearer VA2Q6CKTl00hgVoc27ahfnhu7ky7WsMSxQhHJiPGpH8j6OQVMuxdhJYTF9fJT1H71IrlqPcU7bc4UfZuw`,
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true, // Ensures cookie is sent with request for authentication
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Failed to upload health details');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
            <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
            <input type="text" name="bloodGroup" placeholder="Blood Group" onChange={handleChange} required />
            <select name="smoker" onChange={handleChange} required>
                <option value="">Are you a smoker?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <select name="drinker" onChange={handleChange} required>
                <option value="">Do you drink?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <input type="file" name="fullBodyReport" onChange={handleChange} required />
            <button type="submit">Upload Health Details</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default UploadHealthDetails;
