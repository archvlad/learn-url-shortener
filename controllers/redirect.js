const ShortURL = require('../models/shorturl');

module.exports.redirect = async (req, res) => {
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
};
