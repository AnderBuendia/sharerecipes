import { gql } from 'apollo-server-express';

const userTypeDefs = gql`
  # Types
  type User {
    _id: String
    name: String
    email: String
    role: String
    imageUrl: String
    imageName: String
    confirmed: Boolean
  }

  type FindUsersPayload {
    users: [User]
    total: Int
  }

  # Payloads
  type CreateUserPayload {
    success: Boolean
    token: String
  }

  type AuthenticateUserPayload {
    user: User
    token: String
  }

  type DeleteUserPayload {
    success: Boolean
  }

  type ConfirmUserPayload {
    success: Boolean
  }

  type ForgotUserPasswordPayload {
    success: Boolean
    token: String
  }

  type ResetUserPasswordPayload {
    success: Boolean
  }

  # Inputs (Data Trasnfer Objects)
  input CreateUserDTO {
    email: String
    password: String
    name: String
  }

  input AuthenticateUserDTO {
    email: String
    password: String
  }

  input UpdateUserDTO {
    email: String!
    password: String!
    name: String
  }

  input UpdateUserPasswordDTO {
    email: String!
    password: String!
    confirmPassword: String
  }

  input ConfirmUserDTO {
    token: String
  }

  input DeleteUserDTO {
    email: String
  }

  input ForgotUserPasswordDTO {
    email: String
  }

  input ResetUserPasswordDTO {
    token: String
    password: String
  }

  # Queries
  extend type Query {
    # Users
    find_user: User
    find_user_recipes: [Recipe]
    find_users(offset: Int, limit: Int): FindUsersPayload
  }

  # Mutations
  extend type Mutation {
    # Users
    create_user(input: CreateUserDTO!): CreateUserPayload
    authenticate_user(input: AuthenticateUserDTO!): AuthenticateUserPayload
    update_user(input: UpdateUserDTO): User
    update_user_password(input: UpdateUserPasswordDTO): User
    delete_user(input: DeleteUserDTO!): DeleteUserPayload

    # Confirm User
    confirm_user(input: ConfirmUserDTO!): ConfirmUserPayload

    # Recovery Password
    forgot_user_password(
      input: ForgotUserPasswordDTO!
    ): ForgotUserPasswordPayload
    reset_user_password(input: ResetUserPasswordDTO!): ResetUserPasswordPayload
  }
`;

export default userTypeDefs;
