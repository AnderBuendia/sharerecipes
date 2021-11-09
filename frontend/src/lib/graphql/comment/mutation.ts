import { gql } from '@apollo/client';

export const SEND_COMMENT_RECIPE = gql`
  mutation sendCommentRecipeMutation(
    $recipeUrl: String!
    $input: CommentsRecipeInput
  ) {
    sendCommentRecipe(recipeUrl: $recipeUrl, input: $input) {
      _id
      message
    }
  }
`;

export const VOTE_COMMENT_RECIPE = gql`
  mutation voteCommentRecipeMutation($_id: ID!, $input: CommentsRecipeInput) {
    voteCommentRecipe(_id: $_id, input: $input) {
      _id
      voted
      votes
    }
  }
`;

export const EDIT_COMMENT_RECIPE = gql`
  mutation editCommentRecipeMutation($_id: ID!, $input: CommentsRecipeInput) {
    editCommentRecipe(_id: $_id, input: $input) {
      _id
      message
      edited
    }
  }
`;
