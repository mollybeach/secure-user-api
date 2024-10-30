const express = require('express');
const router = express.Router();
const passport = require('../middleware/oauthAuth');

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
