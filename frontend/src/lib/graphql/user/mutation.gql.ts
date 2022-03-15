import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation create_user($input: CreateUserDTO!) {
    create_user(input: $input) {
      success
    }
  }
`;

export const AUTH_USER = gql`
  mutation authenticate_user($input: AuthenticateUserDTO!) {
    authenticate_user(input: $input) {
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
  mutation confirm_user($input: ConfirmUserDTO!) {
    confirm_user(input: $input) {
      success
    }
  }
`;

export const UPDATE_USER = gql`
  mutation update_user($input: UpdateUserDTO) {
    update_user(input: $input) {
      _id
      name
    }
  }
`;

export const DELETE_USER = gql`
  mutation delete_user($input: DeleteUserDTO!) {
    delete_user(input: $input) {
      success
    }
  }
`;

export const UPDATE_USER_PASSWORD = gql`
  mutation update_user_password($input: UpdateUserPasswordDTO) {
    update_user_password(input: $input) {
      _id
      name
    }
  }
`;

export const FORGOT_USER_PASSWORD = gql`
  mutation forgot_user_password($input: ForgotUserPasswordDTO!) {
    forgot_user_password(input: $input) {
      success
    }
  }
`;

export const RESET_USER_PASSWORD = gql`
  mutation reset_user_password($input: ResetUserPasswordDTO!) {
    reset_user_password(input: $input) {
      success
    }
  }
`;
