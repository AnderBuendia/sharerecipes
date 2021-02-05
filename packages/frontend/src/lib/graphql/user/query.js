import { gql } from '@apollo/client';

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