// replacing this file eventually, don't want to delete until I know it's ok
const { AuthenticationError } = require('apollo-server-express');
const { User, Game, Session, Message } = require('../models');
const { signToken } = require('../utils/auth');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const initialState = {
  id: 'game1',
  board: Array(9).fill(''),
  playerTurn: true,
  winner: '',
  isGameEnded: false,
};

let game = { ...initialState };

function checkWinner() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (
      game.board[a] !== '' &&
      game.board[a] === game.board[b] &&
      game.board[a] === game.board[c]
    ) {
      return game.board[a];
    }
  }

  return null;
}

// currently all the new resolvers and typedefs are specific to tictactoe, need to go through and update everything so that they are labeled in a way which is specific to tictactoe, then create parallel ones to use for chess, and import those into the correct files
const oldresolve = {
  Query: {
    users: async () => {
      return User.find();
    },
    user: async (_, { email }) => {
      return User.findOne({ email: email });
    },
    games: async () => {
      return Game.find();
    },
    game: async (_, { gameId }) => {
      if (gameId === 'game1') {
        return game;
      } else {
        return Game.findOne({ _id: gameId });
      }
    },
    sessions: async (_, { gameId }) => {
      return Session.find(gameId).populate('players');
    },
    session: async (_, { gameId }) => {
      return Session.findOne(gameId).populate('players');
    },
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          '-__v -password'
        );
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    createMessage: async (_, { messageInput: { text, username } }) => {
      const newMessage = new Message({
        text: text,
        createdBy: username,
      });

      const res = await newMessage.save();

      pubsub.publish('MESSAGE_CREATED', {
        messageCreated: {
          text: text,
          createdBy: username,
        },
      });

      return {
        id: res.id,
        ...res._doc,
      };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addProfile: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    createSession: async (parent, { gameId, playerId }) => {
      const existingSession = await Session.findOne({ gameId });
      if (existingSession.id) {
        if (existingSession.players.length === 1) {
          await Session.findOneAndUpdate(
            { gameId },
            { $addToSet: { players: [playerId, 0, 0] } }
          );
        }
      } else {
        await Session.create({ gameId, players: [playerId, 0, 0] });
      }
      return Session;
    },
    closeSession: async (parent, { sessionId }) => {
      return Session.findOneAndDelete({ _id: sessionId });
    },
    makeMove: (_, { index }) => {
      if (game.winner || game.board[index] !== '' || game.isGameEnded) {
        return game;
      }

      game.board[index] = game.playerTurn ? 'X' : 'O';
      game.playerTurn = !game.playerTurn;

      const winner = checkWinner();
      if (winner || !game.board.includes('')) {
        game.winner = winner || 'Draw';
        game.isGameEnded = true;
      }

      pubsub.publish('GAME_STATE_UPDATED', { gameStateUpdated: game });

      return game;
    },
    resetGame: () => {
      game = { ...initialState };
      pubsub.publish('GAME_STATE_UPDATED', { gameStateUpdated: game });
      return game;
    },
  },

  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator('MESSAGE_CREATED'),
    },
    gameStateUpdated: {
      subscribe: () => pubsub.asyncIterator(['GAME_STATE_UPDATED']),
    },
  },
};

module.exports = oldresolve;
