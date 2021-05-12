import { gql } from '@apollo/client';

export const CREATE_USER = gql`
    mutation newUser($input: UserInput) {
        newUser(input: $input)
    }
`;

export const AUTH_USER = gql`
    mutation authenticateUser($input: AuthenticateInput) {
        authenticateUser(input: $input) {
            user {
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
    mutation confirmUser($input: TokenInput) {
        confirmUser(input: $input)
    }
`;

export const UPDATE_USER = gql`
    mutation updateUser($input: UserInput) {
        updateUser(input: $input) {
            name
        }
    }
`;

export const UPDATE_USER_PASSWORD = gql`
    mutation updateUserPassword($input: UserPasswordInput) {
        updateUserPassword(input: $input)
    }
`;


export const DELETE_USER = gql`
    mutation deleteUser($email: String!) {
        deleteUser(email: $email)
    }
`;