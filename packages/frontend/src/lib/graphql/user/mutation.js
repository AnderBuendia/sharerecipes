import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
    mutation updateUser($input: UserInput) {
        updateUser(input: $input) {
            name
        }
    }
`;