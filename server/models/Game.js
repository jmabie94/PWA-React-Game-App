const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const game = new Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 120,
    required: true,
  },
  numPlayersRequired: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

const Game = model('Game', gameSchema);

module.exports = Game;
