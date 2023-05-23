const { model, Schema } = require('mongoose');

const messageSchema = new Schema({
  text: String,
  createdBy: String,
});

const Message = model('Message', messageSchema);

module.exports = Message;
