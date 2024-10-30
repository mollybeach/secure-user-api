// path: middleware/oauthAuth.js
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // Here you would usually find the user in your database and return it
    // For now, we'll just return the profile
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
