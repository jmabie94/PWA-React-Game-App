const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
  }

  type Record {
    playerId: String
    ticGamesPlayed: Int
    ticGamesWon: Int
    ticGamesLost: Int
    ticGamesTied: Int
  }

  type Session {
    _id: ID
    gameId: String
    startTime: String
    endTime: String
    players: [Player]
  }

  type Game {
    _id: ID
    name: String
    numPlayersRequired: Int
    isActive: Boolean
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
    user(username: String!): User
    games: [Game]
    game(gameId: String!): Game
    sessions(gameId: String!): [Session]
    session(gameId: String!): Session
    records: [Record]
    record(playerId: String!): Record

    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    addProfile(username: String!, email: String!, password: String!): Auth
    createRecord(playerId: String!): Record
    updateRecord(playerId: String!): Record
    login(email: String!, password: String!): Auth
    createSession(gameId: String!, playerId: String!): Session
    closeSession(sessionId: String!): Session
  }
`;

module.exports = typeDefs;
