// path: index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('./middleware/oauthAuth');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const { sequelize, User } = require('./models');

const app = express();

// CORS configuration
const corsOptions = {
  origin: `http://localhost:${process.env.REACT_APP_CLIENT_PORT}`,
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
app.get('/', (_req, res) => {

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
  console.log(`Server URL: http://localhost:${process.env.REACT_APP_SERVER_PORT}`);
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ 
    errors: [{ msg: 'Something broke!', error: err.message }] 
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ 
    errors: [{ msg: 'Route not found' }] 
  });
});

// Start the server with database sync
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;

sequelize.sync({ force: true }).then(async () => {
  try {
    // Seed initial data
    await User.bulkCreate([
      {
        username: "johndoe",
        email: "johndoe@example.com",
        password: "hashedpassword1",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "janedoe",
        email: "janedoe@example.com",
        password: "hashedpassword2",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "alice",
        email: "alice@example.com",
        password: "hashedpassword3",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('Database synced and seeded');
    
    // Start the server after successful sync and seed
    app.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`);
      console.log(`Server URL: http://localhost:${SERVER_PORT}`);
      console.log('Running in:', process.env.NODE_ENV || 'development');
      console.log('Connected to database:', process.env.DB_NAME);
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Database sync error:', err);
  process.exit(1);
});

module.exports = app;