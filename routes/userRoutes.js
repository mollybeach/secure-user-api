const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../middleware/jwtAuth');

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    // Create a new user in the database
    const user = await User.create({ email, password: hashedPassword });
    res.json(user);
  } catch (error) {
    res.status(400).send('Error creating user');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  
  if (!user) return res.status(400).send('Email not found');

  // Compare the entered password with the stored hash
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  // Generate a JWT token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.header('Authorization', 'Bearer ' + token).send('Logged in successfully');
});

// Protected profile route (requires JWT authentication)
router.get('/profile', jwtAuth, async (req, res) => {
  // Find the authenticated user by ID
  const user = await User.findByPk(req.user.id);
  res.json(user);
});

module.exports = router;
