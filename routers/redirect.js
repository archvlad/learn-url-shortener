const express = require('express');
const redirect = require('../controllers/redirect');

const router = express.Router();

router.get('/:urlId', redirect.redirect);

module.exports = router;
