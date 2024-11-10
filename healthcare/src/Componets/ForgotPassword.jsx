import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // To manage error messages
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email) {
      setError("Email is required");
      return;
    }

    Axios.post("http://localhost:3000/auth/forgot-password", {
      email
    })
    .then((response) => {
      if (response.data.status) {
        alert("Check your email for the reset password link");
        navigate('/login');
      } else {
       
        setError(response.data.message || "An error occurred");
      }
    })
    .catch((err) => {
      console.error("Error from server:", err);
      setError("An error occurred while sending the reset link");
    });
  };

  return (
    <div className="Sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        
        <label htmlFor="email">Email</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        {error && <p className="error-message">{error}</p>} {/* Display error message if exists */}

        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
