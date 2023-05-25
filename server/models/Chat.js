const { model, Schema } = require('mongoose');

const chatSchema = new Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
});

const Chat = model('Chat', chatSchema);

module.exports = Chat;
