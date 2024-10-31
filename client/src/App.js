//path: client/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import './styles/App.css';

export const API_URL = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            {!token ? (
              <>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/profile">Profile</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/profile" />} />
          <Route path="/login" element={
            <Login 
              setToken={setToken} 
              setIsAuthenticated={setIsAuthenticated} 
            />
          } />
          <Route path="/profile" element={
            token ? <Profile token={token} /> : <Navigate to="/login" />
          } />
          <Route path="/" element={
            <div className="home">
              <h1>Secure User API</h1>
              <p>Welcome to our secure user management system</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;