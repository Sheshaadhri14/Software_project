import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
        navigate("/"); // Redirect to home page
      } catch (err) {
        console.error("Error logging out:", err);
        // Optionally show an error message or handle the error
        navigate("/");
      }
    };

    handleLogout();
  }, [navigate("/")]);

  return (
    <div className="logout-container">
      <h2>Logging out...</h2>
      {/* Optionally, you can display a loading spinner or message here */}
    </div>
  );
};

export default Logout;
