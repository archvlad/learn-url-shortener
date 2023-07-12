require('dotenv').config();
const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.once('open', () => console.log('DB Connected'));
  mongoose.connection.on('error', () => console.log('DB Error'));
  return mongoose.connection;
};
