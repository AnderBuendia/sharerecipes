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

export const FIND_RECIPES = gql`
  query find_recipes($sort: String, $offset: Int, $limit: Int) {
    find_recipes(sort: $sort, offset: $offset, limit: $limit) {
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

export const FIND_RECIPE = gql`
  query find_recipe($recipeUrlQuery: String!, $offset: Int!, $limit: Int!) {
    find_recipe(recipeUrlQuery: $recipeUrlQuery) {
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
      url_query
    }
  }

  ${COMMENTS_FRAGMENT}
`;
