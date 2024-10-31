import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../App';
import '../styles/Auth.css';

function Login({ setToken, setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Attempting login to:', `${API_URL}/login`); // Debug log
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // More specific error handling
        if (res.status === 401) {
          throw new Error('Invalid email or password');
        } else {
          throw new Error(data.error || 'Login failed');
        }
      }
      
      // Success case
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setToken(data.token);
      setIsAuthenticated(true);
      navigate('/profile');
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && (
        <div className="error-message">
          {error}
          {error === 'Invalid email or password' && (
            <p className="error-help">
              Please check your credentials and try again.
            </p>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({
              ...formData,
              email: e.target.value.trim() // Remove whitespace
            })}
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({
              ...formData,
              password: e.target.value
            })}
            required
            placeholder="Enter your password"
          />
        </div>
        
        <button type="submit">Login</button>
      </form>

      <div className="auth-links">
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
}

export default Login;
