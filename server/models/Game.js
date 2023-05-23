const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/helpers');

const gameSchema = new Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 120,
    required: true,
  },
  board: {
    type: [String],
    required: true,
  },
  playerTurn: {
    type: Boolean,
    required: true,
  },
  winner: {
    type: String,
  },
  isGameEnded: {
    type: Boolean,
    required: true,
  },
});

const Game = model('Game', gameSchema);

module.exports = Game;
