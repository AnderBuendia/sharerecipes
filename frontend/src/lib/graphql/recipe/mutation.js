import { gql } from '@apollo/client';

export const NEW_RECIPE = gql`
  mutation newRecipe($input: RecipeInput) {
    newRecipe(input: $input) {
      _id
      name
      prep_time
      serves
      ingredients
      difficulty
      style
      image_url
      image_name
      description
      url
    }
  }
`;

export const UPDATE_VOTE_RECIPE = gql`
  mutation updateVoteRecipe($recipeUrl: String!, $input: RecipeInput) {
    updateVoteRecipe(recipeUrl: $recipeUrl, input: $input) {
      _id
      voted
      votes
      average_vote
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation deleteRecipe($_id: ID!) {
    deleteRecipe(_id: $_id)
  }
`;
