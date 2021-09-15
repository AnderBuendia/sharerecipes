import { gql } from '@apollo/client';

export const GET_USER = gql`
  query getUser {
    getUser {
      _id
      name
      email
      role
      image_url
      image_name
      confirmed
    }
  }
`;

export const GET_USERS = gql`
  query getUsers($offset: Int, $limit: Int) {
    getUsers(offset: $offset, limit: $limit) {
      users {
        _id
        name
        email
        role
        confirmed
      }
      total
    }
  }
`;
