const { gql } = require('apollo-server-express');

// refactoring "game", adding stuff
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
  }

  type Session {
    _id: ID
    gameId: String
    startTime: String
    endTime: String
    players: [Player]
  }

  type Game {
    id: ID!
    name: String
    board: [String!]!
    playerTurn: Boolean!
    winner: String
    isGameEnded: Boolean!
  }

  type Message {
    text: String
    createdBy: String
  }

  input MessageInput {
    text: String
    username: String
  }

  type Player {
    playerId: ID
    score: Int
    winner: Boolean
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(email: String!): User
    games: [Game]
    game(gameId: String!): Game!
    sessions(gameId: String!): [Session]
    session(gameId: String!): Session
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    addProfile(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    createMessage(messageInput: MessageInput): Message!
    createSession(gameId: String!, playerId: String!): Session
    closeSession(sessionId: String!): Session
    makeMove(index: Int!): Game!
    resetGame: Game!
  }

  type Subscription {
    messageCreated: Message
    gameStateUpdated: Game!
  }
`;

module.exports = typeDefs;
