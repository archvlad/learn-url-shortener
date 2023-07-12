const ShortURL = require('../models/shorturl');

module.exports.renderHome = async (req, res) => {
  if (req.isAuthenticated()) {
    let urls = await ShortURL.find({ createdBy: req.user._id });
    res.render('index', { urls });
  } else {
    res.redirect('/signin');
  }
};
