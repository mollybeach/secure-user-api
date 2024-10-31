import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../App';
import '../styles/Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (data.errors) {
          const errorMessages = data.errors.map(err => err.msg).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.error || 'Registration failed');
      }
      
      setSuccess('Registration successful! Redirecting to login...');
      setFormData({ username: '', email: '', password: '' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            minLength="3"
          />
          <small className="form-text">
            Username must be at least 3 characters long
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            minLength="6"
          />
          <small className="form-text">
            Password must be at least 6 characters long
          </small>
        </div>
        
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;