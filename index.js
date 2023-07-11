const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const User = require('./models/user');

const shortUrlsApi = require('./routers/shorturls');

const ShortURL = require('./models/shorturl');

const connection = require('./config/db.config');
const passport = require('passport');
connection.once('open', () => console.log('DB Connected'));
connection.on('error', () => console.log('DB Error'));

const setUpPassport = require('./config/setuppassport');
setUpPassport();

const app = express();

const PORT = process.env.PORT || 3000;

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('short'));

app.use(express.static(path.resolve(__dirname, 'static')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.use(
  session({
    secret: 'cat',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'You must be logged in');
    res.redirect('/signin');
  }
}

app.use('/api', ensureAuthenticated, shortUrlsApi);

app.get('/signin', (req, res) => {
  res.render('signin');
});

app.post(
  '/signin',
  passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true,
    successFlash: true,
  })
);

app.get('/register', (req, res) => {
  res.render('register');
});

app.post(
  '/register',
  (req, res, next) => {
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
  },
  passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true,
  })
);

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/signin');
  });
});

app.get('/', ensureAuthenticated, async (req, res) => {
  let urls = await ShortURL.find({ createdBy: req.user._id });
  res.render('index', { urls });
});

app.get('/:urlId', async (req, res) => {
  let url = await ShortURL.findOne({ urlId: req.params.urlId });
  if (url) {
    await ShortURL.updateOne(
      {
        urlId: req.params.urlId,
      },
      { $inc: { clicks: 1 } }
    );
    res.redirect(url.origUrl);
  } else {
    res.redirect('/');
  }
});

app.listen(PORT, () => console.log(`Express app listening on port ${PORT}`));
