const mongoose = require('mongoose');

//TODO: change URL
mongoose.connect(
  process.env.MONGODB_URI || "mongodb+srv://jorgeelectron:c8ytSxVLk6bIoFK3@cluster0.urmn6ua.mongodb.net/gameroom-db?retryWrites=true&w=majority"
);

module.exports = mongoose.connection;
