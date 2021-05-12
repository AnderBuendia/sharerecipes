import { gql } from '@apollo/client';

export const NEW_RECIPE = gql`
    mutation newRecipe($input: RecipeInput) {
        newRecipe(input: $input) {
            id
            name
            prep_time
            serves
            ingredients
            difficulty
            style
            description
            image_url
            image_name
        }
    }
`;

export const UPDATE_VOTE_RECIPE = gql`
    mutation updateVoteRecipe($recipeUrl: String!, $input: RecipeInput) {
        updateVoteRecipe(recipeUrl: $recipeUrl, input: $input) {
            average_vote
        }
    }
`;

export const DELETE_RECIPE = gql`
    mutation deleteRecipe($recipeUrl: String!) {
        deleteRecipe(recipeUrl: $recipeUrl)
    }        
`;