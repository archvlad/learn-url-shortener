const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => (user ? done(null, user) : done(null, false)));
  });

  passport.use(
    'login',
    new LocalStrategy((username, password, done) => {
      User.findOne({ username }).then((user, err) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'No user has that username' });
        user.checkPassword(password, (err, isMatch) => {
          if (err) return done(err);
          if (isMatch) return done(null, user);
          return done(null, false, { message: 'Invalid password' });
        });
      });
    }),
  );
};
