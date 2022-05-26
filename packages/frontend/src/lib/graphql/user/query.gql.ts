import { gql } from '@apollo/client';

export const FIND_USER = gql`
  query find_user {
    find_user {
      _id
      name
      email
      role
      imageUrl
      imageName
      confirmed
    }
  }
`;

export const FIND_USERS = gql`
  query find_users($offset: Int, $limit: Int) {
    find_users(offset: $offset, limit: $limit) {
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
