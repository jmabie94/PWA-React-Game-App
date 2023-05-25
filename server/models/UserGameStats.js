const { model, Schema } = require('mongoose');

const userGameStatsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gameStats: {
    type: Schema.Types.ObjectId,
    ref: 'GameStats',
    required: true,
  },
});

const UserGameStats = model('UserGameStats', userGameStatsSchema);

module.exports = UserGameStats;
