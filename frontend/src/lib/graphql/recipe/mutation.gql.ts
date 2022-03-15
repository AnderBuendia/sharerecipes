import { gql } from '@apollo/client';

export const CREATE_RECIPE = gql`
  mutation create_recipe($input: CreateRecipeDTO) {
    create_recipe(input: $input) {
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
      average_vote
      url_query
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
      average_vote
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
