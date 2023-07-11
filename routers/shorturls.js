require('dotenv').config();
const express = require('express');

const router = express.Router();

const ShortURL = require('../models/shorturl');

router.post('/shorten', async (req, res) => {
  let url = await ShortURL.findOne({ origUrl: req.body.url });
  if (url) {
    res.redirect('/');
  } else {
    const { nanoid } = await import('nanoid');
    let urlId = nanoid(10);
    url = new ShortURL({
      urlId,
      origUrl: req.body.url,
      shortUrl: `${process.env.BASE_URL}/` + urlId,
      createdBy: req.user._id,
    });
    await url.save();
    res.redirect('/');
  }
});

module.exports = router;
