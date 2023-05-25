const { model, Schema } = require('mongoose');

const gameStatsSchema = new Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  wins: {
    type: Number,
    default: 0,
  },
  draws: {
    type: Number,
    default: 0,
  },
  losses: {
    type: Number,
    default: 0,
  },
});

const GameStats = model('GameStats', gameStatsSchema);

module.exports = GameStats;
