const { model, Schema } = require('mongoose');

const leaderboardSchema = new Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  userGameStats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'UserGameStats',
    },
  ],
});

const Leaderboard = model('Leaderboard', leaderboardSchema);

module.exports = Leaderboard;
