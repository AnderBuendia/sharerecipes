import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation newUserMutation($input: UserInput) {
    newUser(input: $input)
  }
`;

export const AUTH_USER = gql`
  mutation authenticateUserMutation($input: AuthenticateInput) {
    authenticateUser(input: $input) {
      user {
        _id
        name
        email
        role
        image_url
        image_name
        confirmed
      }
      token
    }
  }
`;

export const CONFIRM_USER = gql`
  mutation confirmUserMutation($input: TokenInput) {
    confirmUser(input: $input)
  }
`;

export const UPDATE_USER = gql`
  mutation updateUserMutation($input: UserInput) {
    updateUser(input: $input) {
      name
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUserMutation($email: String!) {
    deleteUser(email: $email)
  }
`;

export const UPDATE_USER_PASSWORD = gql`
  mutation updateUserPasswordMutation($input: UserPasswordInput) {
    updateUserPassword(input: $input)
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation forgotPasswordMutation($input: EmailInput) {
    forgotPassword(input: $input)
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPasswordMutation($input: UserPasswordInput) {
    resetPassword(input: $input)
  }
`;
