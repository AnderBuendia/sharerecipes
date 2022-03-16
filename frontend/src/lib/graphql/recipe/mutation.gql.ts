import { gql } from '@apollo/client';

export const CREATE_RECIPE = gql`
  mutation create_recipe($input: CreateRecipeDTO) {
    create_recipe(input: $input) {
      _id
      name
      prepTime
      serves
      ingredients
      difficulty
      style
      imageUrl
      imageName
      description
      averageVote
      urlQuery
      comments {
        _id
      }
    }
  }
`;

export const VOTE_RECIPE = gql`
  mutation vote_recipe($recipeUrlQuery: String!, $input: VoteRecipeDTO) {
    vote_recipe(recipeUrlQuery: $recipeUrlQuery, input: $input) {
      _id
      voted
      votes
      averageVote
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation delete_recipe($recipeId: String!) {
    delete_recipe(recipeId: $recipeId) {
      success
    }
  }
`;
