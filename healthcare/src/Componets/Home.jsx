import React, { useState, useEffect } from "react";
import { Buffer } from 'buffer';

import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/verify", { withCredentials: true });
        if (response.data.status) {
          setIsAuthenticated(true);
          setIsDoctor(response.data.isDoctor);
        } else {
          setIsAuthenticated(false);
          navigate('/login');
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
      setIsAuthenticated(false);
      setIsDoctor(false);
      navigate("/"); 
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="home-container">
      <form className="main-form">
      <header className="header">
        <h1>Decentralized Health Record Management System</h1>
        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <button type="button" onClick={() => navigate('/upload-health-details')}>Upload </button>
              {isDoctor && (
                <button type="button" onClick={() => navigate('/dashboard')}>Dashboard</button>
              )}
              <button type="button" className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => navigate('/login')}>Login</button>
              <button type="button" onClick={() => navigate('/signup')}>SignUp</button>
            </>
          )}
        </div>
      </header>
      <main className="main-content">
        <section className="about-us">
          <h2>About Us</h2>
          <p>
            We are revolutionizing healthcare by giving patients control over their medical records through our decentralized system. Your records are secure, accessible, and managed with the highest standards of data integrity.
          </p>
        </section>

        <section className="services">
          <h2>Our Services</h2>
          <div className="service-items">
            <div className="service-item">
              <img src="EMER.png" alt="Close-up of Emergency Hospital Building" />
              <h3>Emergency Care</h3>
              <p>24/7 emergency services with cutting-edge medical technology to ensure timely and effective care.</p>
            </div>
            <div className="service-item">
              <img src="OUT.png" alt="Outpatient Services" />
              <h3>Outpatient Services</h3>
              <p>Comprehensive outpatient services including specialist consultations and diagnostics.</p>
            </div>
            <div className="service-item">
              <img src="IN.png" alt="Inpatient Services" />
              <h3>Inpatient Services</h3>
              <p>High-quality inpatient care with modern facilities and experienced healthcare professionals.</p>
            </div>
          </div>
        </section>

        <section className="our-team">
          <h2>Meet Our Team</h2>
          <div className="team-members">
            <div className="team-member">
              <img src="DOCTOR1.png" alt="Dr. John Doe" />
              <h3>Dr. John Doe</h3>
              <p>Chief Surgeon</p>
            </div>
            <div className="team-member">
              <img src="DOCTOR2.png" alt="Dr. Jane Smith" />
              <h3>Dr. Jane Smith</h3>
              <p>Head of Pediatrics</p>
            </div>
          </div>
        </section>

        <section className="contact-us">
          <h2>Contact Us</h2>
          <p>
            Have questions or need assistance? Reach out to us at (123) 456-7890 or email us at info@healthcare.com.
          </p>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 Decentralized Health Record Management System. All rights reserved.</p>
        <nav>
          <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
        </nav>
      </footer>
      </form>
    </div>
  );
};

export default Home;
