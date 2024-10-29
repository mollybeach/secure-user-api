const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    // You can save the user profile or return it to the done callback
    // This is where you would look for the user in your database
    return done(null, profile);
  }
));

// To serialize user info into session
passport.serializeUser((user, done) => {
  done(null, user);
});

// To deserialize user info from session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
