// frontend/src/App.js
import React, { useState } from 'react';

const serverPort = process.env.SERVER_PORT || 3000;
const apiUrl = `http://localhost:${serverPort}`;

function App() {
  const [response, setResponse] = useState('');

  // Function to handle registering a user
  const handleRegister = async () => {
    const user = {
      email: 'johndoe@example.com',
      password: '123456',
    };

    try {
      const res = await fetch(`${apiUrl}/api/register`, {
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
    <div className="App">
      <h1>Secure User API</h1>

      <button onClick={handleRegister}>Register User</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGetUsers}>Get Users</button>

      <h2>Response:</h2>
      <pre>{response}</pre>
    </div>
  );
}

export default App;
