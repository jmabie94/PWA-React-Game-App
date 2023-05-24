const { AuthenticationError } = require('apollo-server-express');
const { User, Game, Session, Message } = require('../models');
const { signToken } = require('../utils/auth');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();
// const messages = [];

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    user: async (_, { email }) => {
      return User.findOne({ email: email });
    },
    messages: async () => {
      return Message.find();
    },
    games: async () => {
      return Game.find();
    },
    game: async (_, { gameId }) => {
      return Game.findOne({ _id: gameId });
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
    createMessage: async (_, { messageInput: { text, username}}) => {
      const newMessage = new Message({
        text: text,
        createdBy: username
      });

      const res = await newMessage.save();

      pubsub.publish('MESSAGE_CREATED', {
        messageCreated: {
          text: text,
          createdBy: username
        }
      });

      return {
        id: res.id,
        ...res._doc
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
    addProfile: async (parent, {username, email, password}) => {
      const user = await User.create({username, email, password});
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
  },

  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator('MESSAGE_CREATED')
    }
  }
};

module.exports = resolvers;
