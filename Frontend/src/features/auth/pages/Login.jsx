import React from 'react';
import { useNavigate, Link } from "react-router";
import '../auth.form.scss';
import { useAuth } from '../hooks/useAuth.js';


const Login = () => {
  const { loading, handlelogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await handlelogin({ email, password });
      navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <main>
        <div className="form-container">
          <h1>Login</h1>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
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

            <button type="submit" className="button primary-button" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
