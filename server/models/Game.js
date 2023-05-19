const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/helpers');

const gameSchema = new Schema({
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
