import { gql } from '@apollo/client';

export const GET_NUMBER_OF_COMMENTS = gql`
query getNumberOfComments($recipeUrl: String!) {
    getNumberOfComments(recipeUrl: $recipeUrl) {
        id
    }
}
`;