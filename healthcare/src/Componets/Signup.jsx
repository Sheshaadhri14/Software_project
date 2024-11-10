import React, { useState } from "react";
import "../App.css";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient"); // Default role is patient
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  // Email validation regex pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = "";
    if (password.length >= 8) {
      if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) {
        strength = "Strong";
      } else if (/[A-Z]/.test(password) || /\d/.test(password) || /[!@#$%^&*]/.test(password)) {
        strength = "Medium";
      } else {
        strength = "Weak";
      }
    } else {
      strength = "Too short";
    }
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Email validation
    if (!emailPattern.test(email)) {
      setError("Invalid email format.");
      return;
    }

    // Password strength validation
    if (passwordStrength !== "Strong") {
      setError("Password is not strong enough.");
      return;
    }

    try {
      const response = await Axios.post("http://localhost:3000/auth/signup", {
        username,
        email,
        password,
        role,
      });

      if (response.data.status) {
        navigate("/login");
      } else {
        setError(response.data.message || "Sign up failed.");
      }
    } catch (err) {
      console.error("Error from server:", err);
      setError("An error occurred/Already existing user. Please try again.");
    }
  };

  return (
    <div className="Sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        {error && <p className="error-message">{error}</p>}

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => {
            if (!emailPattern.test(email)) setError("Invalid email format.");
          }}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            checkPasswordStrength(e.target.value);
          }}
        />
        <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
          Password strength: {passwordStrength}
        </p>

        <label htmlFor="role" className="role-label">Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="role-select">
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
        </select>

        <button type="submit">Sign up</button>
        <p>
          <b>Already have an Account? </b>
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
