// path: routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Assuming you're using Sequelize for models
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../middleware/jwtAuth');
const passport = require('passport');
const { check, validationResult } = require('express-validator');

// Validation middleware
const registerValidation = [
  check('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  check('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter'),
  check('username')
    .optional()
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .matches(/^[A-Za-z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and dashes')
];

const updateValidation = [
  check('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  check('username')
    .optional()
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .matches(/^[A-Za-z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and dashes')
];

// Public Routes
router.get('/users', async (req, res) => {
  try {
    console.log('Attempting to fetch users...');
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });
    
    console.log('Users fetched successfully:', users);
    res.json(users);
  } catch (error) {
    console.error('Detailed error fetching users:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      errors: [{ 
        msg: 'Error fetching users',
        detail: error.message // Adding this for debugging
      }] 
    });
  }
});

router.post('/register', registerValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        errors: [{ msg: 'User already exists with this email' }] 
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('Error creating user');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        errors: [{ msg: 'Invalid credentials' }] 
      });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        errors: [{ msg: 'Invalid credentials' }] 
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response with token
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      errors: [{ msg: 'Server error during login' }] 
    });
  }
});

// Protected Routes (all require jwtAuth)
router.get('/profile', jwtAuth, async (req, res) => {
  try {
    // Find the authenticated user by ID
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).send('User not found');

    res.json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.put('/users/:id', jwtAuth, updateValidation, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user can only update their own profile
    if (req.user.id != id) {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    const { username, email } = req.body;
    const updatedUser = await User.update(
      { username, email },
      { 
        where: { id },
        returning: true
      }
    );

    res.json({ message: "Profile updated successfully", user: updatedUser[1][0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

router.delete('/users/:id', jwtAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure user can only delete their own account
    if (req.user.id != id) {
      return res.status(403).json({ message: "Not authorized to delete this account" });
    }

    await User.destroy({
      where: { id }
    });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting account", error: error.message });
  }
});

// Initiate GitHub OAuth flow
router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub OAuth callback
router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Generate JWT token for the authenticated user
      const token = jwt.sign(
        { id: req.user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // You can either redirect with the token or send it in the response
      res.json({
        message: 'GitHub authentication successful',
        token,
        user: {
          id: req.user.id,
          email: req.user.email
        }
      });
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.status(500).json({ message: 'Authentication failed' });
    }
  }
);

// Optional: Add a logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Verify token route (helpful for debugging)
router.get('/verify-token', jwtAuth, (req, res) => {
  res.json({ 
    valid: true, 
    user: req.user 
  });
});

module.exports = router;
