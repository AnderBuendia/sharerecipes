import { gql } from '@apollo/client';

export const NEW_RECIPE = gql`
  mutation newRecipeMutation($input: RecipeInput) {
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
    }
  }
`;

export const VOTE_RECIPE = gql`
  mutation voteRecipeMutation($recipeUrl: String!, $input: RecipeInput) {
    voteRecipe(recipeUrl: $recipeUrl, input: $input) {
      _id
      voted
      votes
      average_vote
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation deleteRecipeMutation($_id: ID!) {
    deleteRecipe(_id: $_id)
  }
`;
