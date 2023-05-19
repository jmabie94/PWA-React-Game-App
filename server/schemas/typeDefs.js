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
    startTime: Date
    endTime: Date
    players: [Player]
  }

type Player {
    playerId: ID
    score: Number
    winner: Boolean
}

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users:[User]
    user(username: String!): User
    games:[Game]
    game(gameId: String!): Game
    sessions: []
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    createSession (gameId: String!, playerId: String!): Session
    closeSession (sessionId)
  }
`;

module.exports = typeDefs;
