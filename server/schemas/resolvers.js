const { AuthenticationError } = require('apollo-server-express');
const {
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
} = require('../models');
const { signToken } = require('../utils/auth');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const resolvers = {
  Query: {
    user: async (_, { email }) => {
      return User.findOne({ email: email }).populate('records');
    },
    users: async () => {
      return User.find().populate('records');
    },
    getUser: async (parent, { id }) => {
      return User.findById(id);
    },
    getGame: async (parent, { id }) => {
      return Game.findById(id).populate('records');
    },
    getBoard: async (parent, { id }) => {
      return Board.findById(id);
    },
    getSession: async (parent, { id }) => {
      return Session.findById(id);
    },
    getMessages: async () => {
      return Message.find();
    },
    getLeaderBoard: async () => {
      const userGameStats = await UserGameStats.find().populate('user');
      return userGameStats;
    },
    getAllGames: async () => {
      return Game.find();
    },
    getAllUsers: async () => {
      return User.find();
    },
  },
  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    createProfile: async (parent, { userId }) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found!');
      }
      const profile = await Profile.create({ user: user._id, gameStats: [] });
      return profile;
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },

    createRecord: async (parent, { playerId, gameName }) => {
      return User.findOneAndUpdate(
        { _id: playerId },
        {
          $addToSet: { records: { gameName } },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    },

    // updateRecord: async (
    //   parent,
    //   { playerId, gameName, gamesPlayed, gamesWon, gamesTied, gamesLost }
    // ) => {
    //   return User.findOneAndUpdate(
    //     { _id: playerId, 'records.gameName': gameName },
    //     {
    //       'records.$.gamesPlayed': gamesPlayed,
    //       'records.$.gamesWon': gamesWon,
    //       'records.$.gamesTied': gamesTied,
    //       'records.$.gamesLost': gamesLost,
    //     },

    //     {
    //       new: true,
    //       runValidators: true,
    //     }
    //   );
    // },
    updateRecord: async (parent, { playerId, gameName }) => {
      return User.findOneAndUpdate(
        { _id: playerId, 'records.gameName': gameName },
        {
          $inc: { 'records.$.gamesPlayed': 1, 'records.$.gamesWon': 1 },
        },

        {
          new: true,
          runValidators: true,
        }
      );
    },

    createGame: async (parent, { name }) => {
      const game = await Game.create({ name });
      return game;
    },
    createBoard: async (parent, { gameId, userIds }) => {
      const board = await Board.create({ gameId, users: userIds });
      return board;
    },
    createSession: async (parent, { gameId, userIds, spectatorIds }) => {
      const session = await Session.create({
        gameId,
        players: playerIds,
        spectators: spectatorIds,
      });
      return session;
    },
    createMessage: async (parent, { text, userId }) => {
      const newMessage = new Message({
        text: text,
        sender: userId,
      });

      const res = await newMessage.save();

      pubsub.publish('MESSAGE_CREATED', {
        messageAdded: {
          text: text,
          sender: userId,
        },
      });

      return {
        id: res.id,
        ...res._doc,
      };
    },
    updateBoard: async (parent, { boardId, whoseTurn, isGameOver, winner }) => {
      const updatedBoard = await Board.findByIdAndUpdate(
        boardId,
        { whoseTurn, isGameOver, winner },
        { new: true }
      );
      pubsub.publish('GAME_BOARD_UPDATED', { boardUpdated: updatedBoard });

      return updatedBoard;
    },
    updateGameStats: async (parent, { userId, gameId, result }) => {
      const gameStats = await GameStats.findOneAndUpdate(
        { user: userId, game: gameId },
        { $inc: { [result]: 1 } },
        { new: true, upsert: true }
      );
      pubsub.publish('LEADERBOARD_UPDATED', { leaderboardUpdated: gameStats });

      return gameStats;
    },
    updateUserGameStats: async (parent, { userId, gameStatsId }) => {
      const updatedUserGameStats = await UserGameStats.findByIdAndUpdate(
        gameStatsId,
        { user: userId },
        { new: true }
      );
      return updatedUserGameStats;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: (parent, { chatId }, { pubsub }) =>
        pubsub.asyncIterator('MESSAGE_CREATED'),
    },
    boardUpdated: {
      subscribe: (parent, { boardId }, { pubsub }) =>
        pubsub.asyncIterator(['GAME_BOARD_UPDATED']),
    },
    leaderboardUpdated: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator(['LEADERBOARD_UPDATED']),
    },
  },
  Board: {
    gameId: (parent) => parent.gameId.toString(),
    users: async (parent) => {
      const userIds = parent.users.map((userId) => userId.toString());
      const users = await User.find({ _id: { $in: userIds } });
      return users;
    },
    whoseTurn: (parent) => parent.whoseTurn.toString(),
    winner: (parent) => parent.winner.toString(),
    // I think the chat is based on BoardId so this might be wrong
    chat: async (parent) => {
      if (!parent.chat) {
        return null;
      }
      const chat = await Chat.findById(parent.chat);
      return chat;
    },
  },
  Message: {
    id: (parent) => parent.id.toString(),
    user: async (parent) => {
      const user = await User.findById(parent.user);
      return user;
    },
  },
  Chat: {
    id: (parent) => parent.id.toString(),
    gameId: (parent) => parent.gameId.toString(),
    messages: async (parent) => {
      const messageIds = parent.messages.map((messageId) =>
        messageId.toString()
      );
      const messages = await Message.find({ _id: { $in: messageIds } });
      return messages;
    },
  },
  User: {
    id: (parent) => parent.id.toString(),
    gameStats: async (parent) => {
      const gameStats = await GameStats.find({ user: parent.id });
      return gameStats;
    },
    profile: async (parent) => {
      const profile = await Profile.findOne({ user: parent.id });
      return profile;
    },
  },
  Game: {
    id: (parent) => parent.id.toString(),
    boards: async (parent) => {
      const boards = await Board.find({ gameId: parent.id });
      return boards;
    },
  },
  Session: {
    id: (parent) => parent.id.toString(),
    gameId: (parent) => parent.gameId.toString(),
    players: async (parent) => {
      const playerIds = parent.players.map((playerId) => playerId.toString());
      const players = await User.find({ _id: { $in: playerIds } });
      return players;
    },
    spectators: async (parent) => {
      const spectatorIds = parent.players.map((spectactorId) =>
        spectatorId.toString()
      );
      const spectators = await User.find({ _id: { $in: spectatorIds } });
      return spectators;
    },
  },
  Player: {
    playerId: (parent) => parent.playerId.toString(),
  },
  GameStats: {
    id: (parent) => parent.id.toString(),
    game: async (parent) => {
      const game = await Game.findById(parent.game);
      return game;
    },
    wins: (parent) => parent.wins,
    losses: (parent) => parent.losses,
  },
  UserGameStats: {
    id: (parent) => parent.id.toString(),
    user: async (parent) => {
      const user = await User.findById(parent.user);
      return user;
    },
    gameStats: async (parent) => {
      const gameStats = await GameStats.findById(parent.gameStats);
      return gameStats;
    },
  },
  Profile: {
    id: (parent) => parent.id.toString(),
    user: async (parent) => {
      const user = await User.findById(parent.user);
      return user;
    },
    gameStats: async (parent) => {
      const gameStats = await GameStats.find({ user: parent.user });
      return gameStats;
    },
  },
};

module.exports = resolvers;
