import { gql } from '@apollo/client';

export const SEND_COMMENTS_RECIPE = gql`
    mutation sendCommentsRecipe($recipeUrl: String!, $input: CommentsRecipeInput) {
        sendCommentsRecipe(recipeUrl: $recipeUrl, input: $input) {
            id
            message
        }
    }
`;

export const VOTE_COMMENTS_RECIPE = gql`
    mutation voteCommentsRecipe($id: ID!, $input: CommentsRecipeInput) {
        voteCommentsRecipe(id: $id, input: $input) {
            id
            voted
            votes
        }
    }
`;

export const EDIT_COMMENTS_RECIPE = gql`
    mutation editCommentsRecipe($id: ID!, $input: CommentsRecipeInput) {
        editCommentsRecipe(id: $id, input: $input) {
            id
            message
            edited
        }
    }
`;