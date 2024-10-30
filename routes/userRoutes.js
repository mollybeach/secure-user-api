const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Assuming you're using Sequelize for models
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../middleware/jwtAuth');
const pool = require('../config/db'); // For raw SQL queries using the PostgreSQL connection pool

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = await User.create({ email, password: hashedPassword });
    res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send('Error creating user');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).send('Email not found');

    // Compare the entered password with the stored hash
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.header('Authorization', 'Bearer ' + token).json({
      message: 'Logged in successfully',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Protected profile route (requires JWT authentication)
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

// Fetch all users from the database (New Route)
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows); // Return the rows from the query result
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
