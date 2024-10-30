import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import './styles/App.css';

const serverPort = process.env.SERVER_PORT || 3000;
export const apiUrl = `http://localhost:${serverPort}`;

function App() {
  const [response, setResponse] = useState('');

  // Function to handle login
  const handleLogin = async () => {
    const user = {
      email: 'johndoe@example.com',
      password: '123456',
    };

    try {
      const res = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse('Error: ' + err.message);
    }
  };

  // Function to get all users
  const handleGetUsers = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/public/users`);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse('Error: ' + err.message);
    }
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <div>
              <h1>Secure User API</h1>
              <button onClick={handleLogin}>Login</button>
              <button onClick={handleGetUsers}>Get Users</button>
              <h2>Response:</h2>
              <pre>{response}</pre>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;