import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Verification = () => {
    const [doctorId, setDoctorId] = useState('');
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/auth/verify-doctor', { doctorId }, { withCredentials: true });
            if (response.data.status) {
                navigate('/dashboard'); // Redirect to dashboard if verified
            } else {
                alert('Doctor not found, redirecting to home page.');
                navigate('/'); // Redirect to home page if not verified
            }
        } catch (error) {
            console.error('Error verifying doctor:', error);
            alert('An error occurred while verifying the doctor.');
            navigate('/'); // Redirect to home page if an error occurs
        }
    };

    return (
        <div>
            <h2>Doctor Verification</h2>
            <form onSubmit={handleVerify}>
                <input
                    type="text"
                    placeholder="Enter Doctor ID"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    required
                />
                <button type="submit">Verify</button>
            </form>
        </div>
    );
};

export default Verification;
