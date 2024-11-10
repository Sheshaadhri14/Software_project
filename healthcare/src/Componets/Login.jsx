import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
const handleLogin = async (username, password) => {
  try {
      const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password }),
          credentials: 'include' // Important for sending cookies
      });

      const data = await response.json();
      if (data.status) {
          console.log(data.message);
      } else {
          console.error(data.message);
      }
  } catch (error) {
      console.error('Error during login:', error);
  }
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
        setError("Username and password are required");
        return;
    }

    try {
        const response = await Axios.post("http://localhost:3000/auth/login", {
            username,
            password,
        },{ withCredentials: true });

        if (response.data.status) {
            const verifyResponse = await Axios.get("http://localhost:3000/auth/verify", { withCredentials: true });
            if (verifyResponse.data.status) {
                if (verifyResponse.data.isDoctor) {
                    navigate('/');
                } else {
                    navigate('/');
                }
            } else {
                navigate('/');
            }
        } else {
            setError(response.data.message || "Login failed");
        }
    } catch (err) {
        console.error("Error from server:", err);
        setError("An error occurred while logging in");
    }
};


  return (
    <div className="Sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className="error-message">{error}</p>}

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
        <Link to="/forgotpassword">Forgot Password?</Link>
        <p><b>Don't have an Account? </b><Link to="/signup">Sign up</Link></p>
      </form>
    </div>
  );
};

export default Login;
