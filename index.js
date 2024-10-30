require('dotenv').config();

const express = require('express');
const passport = require('./middleware/oauthAuth');
const jwtAuth = require('./middleware/jwtAuth');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Session management (required for Passport.js)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Optional root route
app.get('/', (req, res) => {
  res.send('Welcome to the secure-user-api!');
});

// Routes
app.use('/api', userRoutes);  // User-related routes (e.g., register, login)
app.use('/', authRoutes);     // OAuth authentication routes

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
