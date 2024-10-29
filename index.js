const express = require('express');
const passport = require('./middleware/oauthAuth');
const jwtAuth = require('./middleware/jwtAuth');
const session = require('express-session');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Session management (required for Passport.js)
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true }));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', userRoutes);  // User-related routes
app.use('/', authRoutes);     // OAuth authentication routes

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
