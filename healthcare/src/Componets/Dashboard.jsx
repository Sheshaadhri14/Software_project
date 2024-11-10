// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card, { CardHeader, CardTitle, CardContent } from './card.jsx';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/patients', {
        withCredentials: true
      });
      setPatients(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch patients data');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  const handleCardClick = (patientId) => {
    navigate(`/patientdetails/${patientId}`);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Patient Records
      </h1>
      {patients.length === 0 ? (
        <div className="text-center text-gray-600">
          No patient records available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <Card
              key={patient._id}
              className="cursor-pointer transform transition-transform duration-200 hover:scale-105"
              onClick={() => handleCardClick(patient._id)}
            >
              <CardHeader>
                <CardTitle>{patient.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Age:</span> {patient.age}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Location:</span> {patient.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Blood Group:</span> {patient.bloodGroup}
                  </p>
                  <div className="flex space-x-4 mt-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      patient.smoker ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {patient.smoker ? 'Smoker' : 'Non-Smoker'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      patient.drinker ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {patient.drinker ? 'Drinker' : 'Non-Drinker'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;