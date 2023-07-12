const express = require('express');
const auth = require('../controllers/auth');

const router = express.Router();

router.get('/signin', auth.renderSignIn);

router.post('/signin', auth.authenticateUser);

router.get('/register', auth.renderRegister);

router.post('/register', auth.registerUser, auth.authenticateUser);

router.get('/logout', auth.logoutUser);

module.exports = router;
