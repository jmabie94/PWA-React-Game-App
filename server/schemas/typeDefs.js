const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    gameStats: [GameStats]
    profile: Profile
  }

  type Game {
    id: ID!
    name: String!
    boards: [Board!]!
  }

  type Board {
    id: ID!
    gameId: ID!
    users: [User!]!
    whoseTurn: ID
    isGameOver: Boolean!
    winner: ID
    chat: Chat
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }

  type Chat {
    id: ID!
    gameId: ID!
    messages: [Message!]!
  }

  type Session {
    id: ID!
    gameId: ID!
    players: [Player!]!
    spectators: [User!]!
  }

  type Player {
    playerId: ID!
    score: Int!
    winner: Boolean!
  }

  type GameStats {
    id: ID!
    game: Game!
    wins: Int!
    losses: Int!
  }

  type UserGameStats {
    id: ID!
    user: User!
    gameStats: GameStats!
  }

  type Profile {
    id: ID!
    user: User!
    gameStats: [GameStats]!
  }

  type Auth {
    token: ID!
    user: User
  }

  
  type Query {
    getUser(id: ID!): User
    getGame(id: ID!): Game
    getBoard(id: ID!): Board
    getSession(id: ID!): Session
    getMessages: [Message!]!
    getLeaderBoard: [GameStats!]!
    getAllGames: [Game!]!
    getAllUsers: [User!]!
  }
  
  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    createProfile: Profile
    login(email: String!, password: String!): Auth
    createGame(name: String!): Game!
    createBoard(gameId: ID!, userIds: [ID!]!): Board!
    createSession(gameId: ID!, userIds: [ID!]!, spectatorIds: [ID!]): Session!
    createMessage(text: String!, userId: ID!): Message!
    updateBoard(
      boardId: ID!
      whoseTurn: ID
      isGameOver: Boolean
      winner: ID
      ): Board!
      updateGameStats(userId: ID!, gameId: ID!, result: String!): GameStats!
      updateUserGameStats(userId: ID!, gameStatsId: ID!): UserGameStats!
    }

  type Subscription {
    messageAdded(chatId: ID!): Message!
    boardUpdated(boardId: ID!): Board!
    leaderboardUpdated: [GameStats!]!
  }
  
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
  `;
  
  module.exports = typeDefs;
  
  /* input CreateUserInput {
    username: String!
    email: String!
    password: String!
  } */