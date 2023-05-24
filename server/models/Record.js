const { Schema, model, Types } = require('mongoose');

const recordSchema = new Schema({
  playerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ticGamesPlayed: {
    type: Number,
  },
  ticGamesWon: {
    type: Number,
  },
  ticGamesLost: {
    type: Number,
  },
  ticGamesTied: {
    type: Number,
  },
});

const Record = model('record', recordSchema);

module.exports = Record;
