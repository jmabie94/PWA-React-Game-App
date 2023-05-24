import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query me {
    me {
      _id
      name
      skills
    }
  }
`;

export const QUERY_SINGLE_USER = gql`
  query user($email: String!) {
    user(email: $email) {
      _id
      username
      email
    }
  }
`;

export const QUERY_ALL_USERS = gql`
  query users {
    users {
      username
    }
  }
`;

export const GET_MESSAGES = gql`
  query messages {
    messages {
      text
      createdBy
    }
  }
  `

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
    }
  }
`;
