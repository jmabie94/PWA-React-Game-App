// adding a bunch of new Schemas
const Board = require('./Board');
const Chat = require('./Chat');
const Game = require('./Game');
const GameStats = require('./GameStats');
const Leaderboard = require('./Leaderboard');
const Message = require('./Message');
const Profile = require('./Profile');
const Session = require('./Session');
const User = require('./User');
const UserGameStats = require('./UserGameStats');

// now all models are connected properly
module.exports = {
  Board,
  Chat,
  Game,
  GameStats,
  Leaderboard,
  Message,
  Profile,
  Session,
  User,
  UserGameStats,
};
