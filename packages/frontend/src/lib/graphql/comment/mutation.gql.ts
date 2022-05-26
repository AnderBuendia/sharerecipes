import { gql } from '@apollo/client';

export const SEND_RECIPE_COMMENT = gql`
  mutation send_recipe_comment(
    $recipeUrlQuery: String!
    $input: SendRecipeCommentDTO!
  ) {
    send_recipe_comment(recipeUrlQuery: $recipeUrlQuery, input: $input) {
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

export const VOTE_COMMENT = gql`
  mutation vote_comment($commentId: String!, $input: VoteCommentDTO!) {
    vote_comment(commentId: $commentId, input: $input) {
      _id
      voted
      votes
    }
  }
`;

export const EDIT_COMMENT = gql`
  mutation edit_comment($commentId: String!, $input: EditCommentDTO!) {
    edit_comment(commentId: $commentId, input: $input) {
      _id
      message
      edited
    }
  }
`;
