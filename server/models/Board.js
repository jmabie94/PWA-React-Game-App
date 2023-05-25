const { model, Schema } = require('mongoose');

const boardSchema = new Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  whoseTurn: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  isGameOver: {
    type: Boolean,
    default: false,
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  chat: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
  },
});

const Board = model('Board', boardSchema);

module.exports = Board;
