const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/helpers');

const sessionSchema = new Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
  endTime: {
    type: Date,
    get: (timestamp) => dateFormat(timestamp),
  },
  players: [
    {
      playerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
      winner: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

const Session = model('Session', sessionSchema);

module.exports = Session;
