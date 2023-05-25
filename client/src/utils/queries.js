import { gql } from '@apollo/client';

export const GET_USER = gql`
  query getUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      email
      password
      gameStats {
        id
        game {
          id
          name
        }
        wins
        losses
      }
      profile {
        id
        gameStats {
          id
          game {
            id
            name
          }
          wins
          losses
        }
      }
    }
  }
`;

export const GET_USER_BY_EMAIL = gql`
  query user($email: String!) {
    user(email: $email) {
      username
      email
    }
  }
`;

export const GET_GAME = gql`
  query GetGame($id: ID!) {
    getGame(id: $id) {
      id
      name
      boards {
        id
        gameId
        users {
          id
          username
          email
          password
        }
        whoseTurn
        isGameOver
        winner
      }
    }
  }
`;

export const GET_BOARD = gql`
  query GetBoard($id: ID!) {
    getBoard(id: $id) {
      id
      gameId
      users {
        id
        username
        email
        password
      }
      whoseTurn
      isGameOver
      winner
    }
  }
`;

export const GET_SESSION = gql`
  query GetSession($id: ID!) {
    getSession(id: $id) {
      id
      gameId
      players {
        id
        username
        email
        password
      }
      spectators {
        id
        username
        email
        password
      }
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages {
    getMessages {
      id
      text
      user {
        id
        username
        email
        password
      }
    }
  }
`;

export const GET_LEADERBOARD = gql`
  query GetLeaderboard {
    getLeaderboard {
      id
      game {
        id
        name
      }
      wins
      losses
    }
  }
`;

export const GET_ALL_GAMES = gql`
  query GetAllGames {
    getAllGames {
      id
      name
      boards {
        id
        gameId
        users {
          id
          username
          email
          password
        }
        whoseTurn
        isGameOver
        winner
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query getAllUsers {
    getAllUsers {
      id
      username
      email
      password
      gameStats {
        id
        game {
          id
          name
        }
        wins
        losses
      }
      profile {
        id
        gameStats {
          id
          game {
            id
            name
          }
          wins
          losses
        }
      }
    }
  }
`;
