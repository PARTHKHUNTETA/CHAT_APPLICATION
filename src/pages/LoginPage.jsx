import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { Link, useNavigate } from "react-router-dom";
const LoginPage = () => {
  const { user, submitUserDetails } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <div className="auth--container">
      <div className="form--wrapper">
        <form
          onSubmit={(e) => {
            submitUserDetails(e, credentials);
          }}
        >
          <div className="field--wrapper">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              required
              value={credentials.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="field--wrapper">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              required
              value={credentials.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="field--wrapper">
            <input className="btn btn--lg" type="submit" value="Login" />
          </div>
          <p>
            Don't have an account? Register <Link to="/register">here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
