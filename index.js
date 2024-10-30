// path: index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('./middleware/oauthAuth');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3001', // Your React frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware for parsing JSON bodies
app.use(express.json());

// Session management (required for Passport.js)
app.use(session({
  secret: process.env.JWT_SECRET || 'jwt-secret',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api', userRoutes);  // All routes will be prefixed with /api

// Optional root route
app.get('/', (req, res) => {
  const PORT = process.env.PORT || 3001;
  res.send(`
    <html>
      <body>
        <h1>Welcome to the secure-user-api!</h1>
        <p>Available endpoints:</p>
        <ul>
          <li><a href="/api/users">GET /api/users</a></li>
          <li>POST /api/register</li>
          <li>POST /api/login</li>
          <li>GET /api/profile (protected)</li>
          <li>PUT /api/users/:id (protected)</li>
          <li>DELETE /api/users/:id (protected)</li>
          <li><a href="/api/auth/github">GitHub OAuth Login</a></li>
        </ul>
      </body>
    </html>
  `);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    errors: [{ msg: 'Something broke!', error: err.message }] 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    errors: [{ msg: 'Route not found' }] 
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
});

module.exports = app;