// path: index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('./middleware/oauthAuth');
const jwtAuth = require('./middleware/jwtAuth');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

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

// Optional root route
app.get('/', (req, res) => {
  const SERVER_PORT = process.env.SERVER_PORT || 3000;
  res.send(`
    <html>
      <body>
        <h1>Welcome to the secure-user-api!</h1>
        <p>Click <a href="http://localhost:${SERVER_PORT}/api/public/users">here</a> to visit /api/public/users</p>
        <p>Click <a href="http://localhost:${SERVER_PORT}/api/auth">here</a> to visit /api/auth</p>
        <p>Click <a href="http://localhost:${SERVER_PORT}/api/register">here</a> to visit /api/register</p>
        <p>Click <a href="http://localhost:${SERVER_PORT}/api/login">here</a> to visit /api/login</p>
        <p>Click <a href="http://localhost:${SERVER_PORT}/api/logout">here</a> to visit /api/logout</p>
        <p>Click <a href="http://localhost:${SERVER_PORT}/api/github">here</a> to visit /api/github</p>
        <p>Click <a href="http://localhost:${SERVER_PORT}/api/github/callback">here</a> to visit /api/github/callback</p>
      </body>
    </html>
  `);
});

// Public routes (no auth required)
app.use('/api/public', userRoutes);    // Public routes like /users, /register, /login
app.use('/api/auth', authRoutes);     // For auth-related routes (/login, /register)
app.use('/api/users', userRoutes);    // For user-related routes (/users, /profile)

// Protected routes (require JWT auth)
app.use('/api/protected', jwtAuth, userRoutes); // All protected routes

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
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} \n http://localhost:${PORT}`));