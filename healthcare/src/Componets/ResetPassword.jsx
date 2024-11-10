import React, { useState } from "react";
import "../App.css";
import Axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // To store error messages
  const [success, setSuccess] = useState(null); // To store success messages
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    Axios.post(`http://localhost:3000/auth/reset-password/${token}`, {
      password
    })
      .then((response) => {
        if (response.data.status) {
          setSuccess("Password reset successful. Redirecting to login...");
          setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        console.error("Error from server:", err);
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <div className="Sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <label htmlFor="password">New Password</label>
        <input
          type="password"
          placeholder="******"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset</button>
      </form>
    </div>
  );
};

export default ResetPassword;
