const { gql } = require('apollo-server-express');

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
    users:[User]
    user(email: String!): User
    games:[Game]
    game(gameId: String!): Game
    sessions(gameId: String!): [Session]
    session(gameId: String!): Session
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    addProfile(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    createSession (gameId: String!, playerId: String!): Session
    closeSession (sessionId: String!): Session
  }
`;

module.exports = typeDefs;
