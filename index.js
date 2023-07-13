const path = require('path');
const express = require('express');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const authRouter = require('./routers/auth');
const shortenerRouter = require('./routers/shortener');
const homeRouter = require('./routers/home');
const redirectRouter = require('./routers/redirect');

require('./config/db.config')();
require('./config/setuppassport')();

const app = express();

const PORT = process.env.PORT || 3000;

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('short'));
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});

app.use('/', authRouter);
app.use('/', shortenerRouter);
app.use('/', homeRouter);
app.use('/', redirectRouter);

app.listen(PORT, () => console.log(`Express app listening on port ${PORT}`));
