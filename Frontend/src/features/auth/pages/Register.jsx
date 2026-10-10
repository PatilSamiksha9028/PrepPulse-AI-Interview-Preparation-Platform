import React from "react";
import { useNavigate, Link } from "react-router";
import '../auth.form.scss';
import { useAuth } from "../hooks/useAuth.js";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const { loading, handleregister } = useAuth();

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await handleregister({ username, email, password });
      navigate("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
    }
  };

  if (loading) {
    return (<main><h1>Loading..</h1></main>);
  }

  return (
    <div>
      <main>
        <div className="form-container">
          <h1>Register</h1>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className="button primary-button">
              Register
            </button>
          </form>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;