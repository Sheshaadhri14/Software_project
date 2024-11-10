import React from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);
  const [isDoctor, setIsDoctor] = React.useState(false);

  React.useEffect(() => {
    axios.get("http://localhost:3000/auth/verify")
      .then(res => {
        if (res.data.status) {
          setIsAuthenticated(true);
          setIsDoctor(res.data.isDoctor);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated && !isDoctor) {
    alert("You are not authorized to access the Dashboard.");
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
