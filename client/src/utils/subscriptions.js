import { gql } from '@apollo/client';

export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription messageAdded($chatId: ID!) {
    messageAdded(chatId: $chatId) {
      id
      text
      user {
        id
        username
        email
      }
    }
  }
`;

export const BOARD_UPDATED_SUBSCRIPTION = gql`
  subscription boardUpdated($boardId: ID!) {
    boardUpdated(boardId: $boardId) {
      id
      gameId
      users {
        id
        username
        email
      }
      whoseTurn {
        id
        username
        email
      }
      isGameOver
      winner {
        id
        username
        email
      }
    }
  }
`;

export const LEADERBOARD_UPDATED_SUBSCRIPTION = gql`
  subscription leaderboardUpdated {
    leaderboardUpdated {
      id
      game {
        id
        name
      }
      userGameStats {
        id
        user {
          id
          username
          email
        }
        gameStats {
          id
          wins
          losses
        }
      }
    }
  }
`;
