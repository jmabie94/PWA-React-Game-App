const mongoose = require('mongoose');

//TODO: change URL
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gameroom-db'
);

module.exports = mongoose.connection;
