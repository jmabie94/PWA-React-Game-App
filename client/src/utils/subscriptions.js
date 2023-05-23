import { gql } from '@apollo/client';

export const GET_MESSAGE = gql`
  subscription messageCreated {
    text
    createdBy
  }
`;

export const GAME_STATE_SUBSCRIPTION = gql`
  subscription GameStateSubscription {
    gameStateUpdated {
      id
      name
      board
      playerTurn
      winner
      isGameEnded
    }
  }
`;
