import { gql } from 'apollo-server-express';

const commentTypeDefs = gql`
  # Types
  type Comment {
    _id: String
    message: String
    edited: Boolean
    author: User
    recipe: Recipe
    votes: Int
    voted: [String]
    createdAt: String
  }

  # Inputs
  input EditCommentDTO {
    message: String
  }

  input SendRecipeCommentDTO {
    message: String
  }

  input VoteCommentDTO {
    votes: Int
  }

  # Mutation
  extend type Mutation {
    vote_comment(commentId: String!, input: VoteCommentDTO!): Comment

    edit_comment(commentId: String!, input: EditCommentDTO!): Comment

    send_recipe_comment(
      recipeUrlQuery: String!
      input: SendRecipeCommentDTO!
    ): Comment
  }
`;

export default commentTypeDefs;
