const { model, Schema } = require('mongoose');

const gameSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  boards: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Board',
    },
  ],
});

const Game = model('Game', gameSchema);

module.exports = Game;
