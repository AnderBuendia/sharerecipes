import { gql } from '@apollo/client';

export const COMMENTS_FRAGMENT = gql`
  fragment CommentsFragment on Recipe {
    comments(offset: $offset, limit: $limit) {
      _id
      message
      edited
      createdAt
      votes
      author {
        _id
        name
        email
        image_url
        image_name
      }
    }
  }
`;

export const GET_RECIPES = gql`
  query getRecipes($offset: Int, $limit: Int, $sort: String) {
    getRecipes(offset: $offset, limit: $limit, sort: $sort) {
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
      url
      comments {
        _id
      }
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
        _id
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

  ${COMMENTS_FRAGMENT}
`;
