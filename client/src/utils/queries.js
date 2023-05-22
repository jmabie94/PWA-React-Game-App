import { gql } from '@apollo/client';

export const QUERY_PROFILES = gql`
  query allProfiles {
    profiles {
      _id
      name
      skills
    }
  }
`;

export const QUERY_SINGLE_PROFILE = gql`
  query singleProfile($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      name
      skills
    }
  }
`;

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
  query user($username: String!) {
    user(username: $username) {
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

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
    }
  }
`;
