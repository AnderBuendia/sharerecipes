import { gql } from '@apollo/client';

export const SEND_COMMENTS_RECIPE = gql`
  mutation sendCommentsRecipe(
    $recipeUrl: String!
    $input: CommentsRecipeInput
  ) {
    sendCommentsRecipe(recipeUrl: $recipeUrl, input: $input) {
      _id
      message
    }
  }
`;

export const VOTE_COMMENTS_RECIPE = gql`
  mutation voteCommentsRecipe($_id: ID!, $input: CommentsRecipeInput) {
    voteCommentsRecipe(_id: $_id, input: $input) {
      _id
      voted
      votes
    }
  }
`;

export const EDIT_COMMENTS_RECIPE = gql`
  mutation editCommentsRecipe($_id: ID!, $input: CommentsRecipeInput) {
    editCommentsRecipe(_id: $_id, input: $input) {
      _id
      message
      edited
    }
  }
`;
