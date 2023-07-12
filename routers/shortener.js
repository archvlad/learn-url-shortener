const express = require('express');
const shortener = require('../controllers/shortener');
const { ensureAuthenticated } = require('../controllers/auth');

const router = express.Router();

router.post('/shorten', ensureAuthenticated, shortener.shortenURL);

module.exports = router;
