// PatientDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MediaRenderer } from "@thirdweb-dev/react";
import Card, { CardHeader, CardTitle, CardContent } from './card.jsx'

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const fetchPatientDetails = async () => {
    try {
      const response = await axios.get(`/api/patients/${id}`, {
        withCredentials: true
      });
      setPatient(response.data);
      setFormData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch patient details');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e) => {
    try {
      setUploadStatus('Uploading...');
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('report', file);

      const response = await axios.post(`/api/patients/${id}/reports`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setPatient(prev => ({
        ...prev,
        fullBodyReport: response.data.ipfsUrl
      }));
      setUploadStatus('Upload successful!');
    } catch (err) {
      setUploadStatus('Upload failed. Please try again.');
      console.error('Error uploading file:', err);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/patients/${id}`, formData, {
        withCredentials: true
      });
      setIsEditing(false);
      await fetchPatientDetails();
    } catch (err) {
      setError('Failed to update patient details');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg m-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{patient.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="form-group">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Blood Group
              </label>
              <input
                type="text"
                name="bloodGroup"
                value={formData.bloodGroup || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Health Report</h4>
            {patient.fullBodyReport ? (
              <div className="border rounded-lg p-4">
                <MediaRenderer 
                  src={patient.fullBodyReport}
                  alt="Health Report"
                  className="max-w-full h-auto"
                />
              </div>
            ) : (
              <p className="text-gray-500">No report available</p>
            )}

            {isEditing && (
              <div className="mt-4">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="application/pdf,image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploadStatus && (
                  <p className={`mt-2 text-sm ${
                    uploadStatus.includes('failed') ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {uploadStatus}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg ${
                isEditing 
                  ? 'bg-gray-500 hover:bg-gray-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors duration-200`}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            
            {isEditing && (
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
              >
                Save Changes
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDetails;
