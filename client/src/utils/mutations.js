import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      token
      user {
        _id
        username
        email
        password
      }
    }
  }
`;

export const CREATE_PROFILE = gql`
  mutation CreateProfile {
    createProfile {
      _id
      user {
        _id
        username
        email
        password
      }
    }
  }
`;

export const CREATE_GAME = gql`
  mutation CreateGame($name: String!) {
    createGame(name: $name) {
      _id
      name
      boards {
        _id
        gameId
        users {
          _id
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

export const CREATE_BOARD = gql`
  mutation CreateBoard($gameId: ID!, $userIds: [ID!]!) {
    createBoard(gameId: $gameId, userIds: $userIds) {
      _id
      gameId
      users {
        _id
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

export const CREATE_SESSION = gql`
  mutation CreateSession($gameId: ID!, $userIds: [ID!]!, $spectatorIds: [ID!]) {
    createSession(
      gameId: $gameId
      userIds: $userIds
      spectatorIds: $spectatorIds
    ) {
      _id
      gameId
      players {
        _id
        username
        email
        password
      }
      spectators {
        _id
        username
        email
        password
      }
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($text: String!, $userId: ID!) {
    createMessage(text: $text, userId: $userId) {
      _id
      text
      user {
        _id
        username
        email
        password
      }
    }
  }
`;

export const UPDATE_BOARD = gql`
  mutation UpdateBoard(
    $boardId: ID!
    $whoseTurn: ID
    $isGameOver: Boolean
    $winner: ID
  ) {
    updateBoard(
      boardId: $boardId
      whoseTurn: $whoseTurn
      isGameOver: $isGameOver
      winner: $winner
    ) {
      _id
      gameId
      users {
        _id
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

export const UPDATE_GAME_STATS = gql`
  mutation UpdateGameStats($userId: ID!, $gameId: ID!, $result: String!) {
    updateGameStats(userId: $userId, gameId: $gameId, result: $result) {
      _id
      game {
        _id
        name
      }
      wins
      losses
    }
  }
`;

export const UPDATE_USER_GAME_STATS = gql`
  mutation UpdateUserGameStats($userId: ID!, $gameStatsId: ID!) {
    updateUserGameStats(userId: $userId, gameStatsId: $gameStatsId) {
      _id
      user {
        _id
        username
        email
        password
      }
      gameStats {
        _id
        game {
          _id
          name
        }
        wins
        losses
      }
    }
  }
`;
