import { gql } from '@apollo/client';
import Discussion from '../../../components/recipes/recipe/Discussion';

export const GET_RECIPES = gql`
  query getRecipes($offset: Int, $limit: Int) {
    getRecipes(offset: $offset, limit: $limit) {
      _id
      name
      serves
      ingredients
      prep_time
      difficulty
      image_url
      style
      description
      average_vote
      url
    }
  }
`;

export const GET_BEST_RECIPES = gql`
  query getBestRecipes($offset: Int, $limit: Int) {
    getBestRecipes(offset: $offset, limit: $limit) {
      _id
      name
      serves
      ingredients
      prep_time
      difficulty
      image_url
      style
      description
      average_vote
      url
    }
  }
`;

export const GET_RECIPE = gql`
  query getRecipe($recipeUrl: String!, $offset: Int!, $limit: Int!) {
    getRecipe(recipeUrl: $recipeUrl) {
      _id
      name
      prep_time
      serves
      ingredients
      description
      difficulty
      style
      image_url
      image_name
      author {
        name
        email
      }
      ...CommentsFragment
      votes
      voted
      average_vote
      url
    }
  }
  ${Discussion.fragments.comments}
`;
