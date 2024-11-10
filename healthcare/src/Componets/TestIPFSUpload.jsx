import React, { useState } from 'react';
import axios from 'axios';

const TestIPFSUpload = () => {
  const [file, setFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setResponseMessage('');

    if (!file) {
      setResponseMessage('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/auth/test-ipfs-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (response.data.status) {
        setResponseMessage(`File uploaded to IPFS! IPFS URL: ${response.data.ipfsUrl}`);
      } else {
        setResponseMessage('Failed to upload file to IPFS');
      }
    } catch (err) {
      console.error('Error:', err);
      setResponseMessage(err.response?.data?.message || 'Server error during file upload');
    }
  };

  return (
    <div className="test-upload">
      <h2>Test IPFS Upload</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload to IPFS</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default TestIPFSUpload;
