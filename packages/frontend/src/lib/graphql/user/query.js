import { gql } from '@apollo/client';

export const GET_USER = gql`
    query getUser {
        getUser {
            id
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
                name
                email
                role
                confirmed
            }
            total
        }
    }
`;

export const FORGOT_PASSWORD = gql`
    mutation forgotPassword($input: EmailInput) {
        forgotPassword(input: $input)
    }
`;

export const RESET_PASSWORD = gql`
    mutation resetPassword($input: UserPasswordInput) {
        resetPassword(input: $input)
    }
`;