// path: index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const { sequelize, User } = require('./models');
const { ensureAuthenticated } = require('./middleware/auth');

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

// Serve static files from the public directory
app.use(express.static('public'));

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

// Passport configuration
passport.use(new GitHubStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.REACT_APP_SERVER_PORT}/auth/github/callback`
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      // Find or create user in your database
      let [user] = await User.findOrCreate({
        where: { githubId: profile.id },
        defaults: {
          username: profile.username,
          email: profile.emails?.[0]?.value,
          password: 'github-auth' // You might want to handle this differently
        }
      });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Add GitHub OAuth routes
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] })
);

app.get('/auth/github/callback', 
  passport.authenticate('github', { 
    failureRedirect: '/login?error=github_auth_failed',
    successRedirect: '/?success=github_auth_success'
  })
);

// Add a logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// API Routes
app.use('/api', userRoutes);  // All routes will be prefixed with /api

// Root route
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to the API',
    status: 'Server is running',
    serverUrl: `http://localhost:${process.env.REACT_APP_SERVER_PORT}`,
    documentation: '/api-docs', // if you have API documentation
    version: '1.0.0'
  });
  
  // Log server URL to console (optional)
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

// Protected route example
app.get('/profile', ensureAuthenticated, (req, res) => {
  res.json(req.user);
});

module.exports = app;