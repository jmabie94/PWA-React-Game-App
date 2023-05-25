import { gql } from '@apollo/client';

export const GET_MESSAGE = gql`
subscription OnMessageCreated {
  createMessage{
    text
    createdBy
  }
}
`;