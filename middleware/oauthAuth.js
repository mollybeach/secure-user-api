// path: middleware/oauthAuth.js
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { User } = require('../models');

// Configure GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.REACT_APP_SERVER_PORT}/auth/github/callback`
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      const [user] = await User.findOrCreate({
        where: { githubId: profile.id },
        defaults: {
          email: profile.emails?.[0]?.value,
          username: profile.username
        }
      });
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
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
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
