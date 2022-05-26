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
        imageUrl
        imageName
      }
    }
  }
`;

export const FIND_RECIPES = gql`
  query find_recipes($sort: String, $query: String, $offset: Int, $limit: Int) {
    find_recipes(sort: $sort, query: $query, offset: $offset, limit: $limit) {
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

export const FIND_RECIPE = gql`
  query find_recipe($recipeUrlQuery: String!, $offset: Int!, $limit: Int!) {
    find_recipe(recipeUrlQuery: $recipeUrlQuery) {
      _id
      name
      prepTime
      serves
      ingredients
      description
      difficulty
      style
      imageUrl
      imageName
      author {
        _id
        name
        email
      }
      ...CommentsFragment
      votes
      voted
      averageVote
      urlQuery
    }
  }

  ${COMMENTS_FRAGMENT}
`;
