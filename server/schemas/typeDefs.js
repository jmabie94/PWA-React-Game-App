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
    game(gameId: String!): Game
    messages: [Message]
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
  }
  
  type Subscription {
    messageCreated: Message
  } 
  `;

module.exports = typeDefs;
