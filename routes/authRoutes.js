const express = require('express');
const router = express.Router();
const passport = require('../middleware/oauthAuth');

// Route to start the GitHub OAuth login process
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub will redirect to this URL after successful login
router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful login, redirect to the home page or profile
    res.redirect('/profile');
  }
);

module.exports = router;
