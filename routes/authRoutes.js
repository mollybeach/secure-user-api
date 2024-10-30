const express = require('express');
const router = express.Router();
const passport = require('../middleware/oauthAuth');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const bcrypt = require('bcrypt');

// Add regular login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response
    res.json({ token, user: { id: user.id, email: user.email } });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ errors: [{ msg: 'Server error during login' }] });
  }
});

// Route to start the GitHub OAuth login process
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub will redirect to this URL after successful login
router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful login, you can set a JWT or session token here
    // Generate a JWT token if needed
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token to the client or redirect to profile/home page
    res.header('Authorization', 'Bearer ' + token).redirect('/profile');
  }
);

module.exports = router;
