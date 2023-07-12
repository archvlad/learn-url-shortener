const passport = require('passport');
const User = require('../models/user');

module.exports.renderSignIn = (req, res) => {
  res.render('signin');
};

module.exports.authenticateUser = passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/signin',
  failureFlash: true,
  successFlash: true,
});

module.exports.renderRegister = (req, res) => {
  res.render('register');
};

module.exports.registerUser = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    User.findOne({ username }).then((user) => {
      if (user) {
        req.flash('error', 'User already exists');
        return res.redirect('/register');
      }
      let newUser = new User({
        username,
        password,
      });
      newUser.save().then(() => {
        next();
      });
    });
  } else {
    req.flash('error', 'Enter login and password');
    return res.redirect('/register');
  }
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/signin');
  });
};

module.exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'You must be logged in');
    res.redirect('/signin');
  }
};
