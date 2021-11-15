import { gql } from 'apollo-server-express';

const recipeTypeDefs = gql`
  # Types
  type Recipe {
    _id: ID
    name: String
    serves: Int
    ingredients: [String]
    prep_time: Int
    difficulty: RecipeDifficulty
    image_name: String
    image_url: String
    description: String
    style: String
    comments(offset: Int, limit: Int): [CommentsRecipe]
    votes: Float
    voted: [String]
    average_vote: Float
    url: String
    author: User
    createdAt: String
  }

  type CommentsRecipe {
    _id: ID
    message: String
    edited: Boolean
    author: User
    votes: Int
    voted: [String]
    createdAt: String
  }

  # Inputs
  input RecipeInput {
    name: String
    serves: Int
    prep_time: Int
    ingredients: [String]
    difficulty: RecipeDifficulty
    style: String
    description: String
    image_url: String
    image_name: String
    votes: Float
  }

  input CommentsRecipeInput {
    recipe: ID
    message: String
    edited: Boolean
    votes: Int
  }

  enum RecipeDifficulty {
    EASY
    MEDIUM
    HARD
  }

  # Query
  extend type Query {
    getRecipes(offset: Int, limit: Int, sort: String): [Recipe]
    getUserRecipes: [Recipe]
    getRecipe(recipeUrl: String!, offset: Int, limit: Int): Recipe
  }

  # Mutation
  extend type Mutation {
    newRecipe(input: RecipeInput): Recipe
    updateRecipe(recipeUrl: String!, input: RecipeInput): Recipe
    deleteRecipe(_id: ID!): Boolean
    voteRecipe(recipeUrl: String!, input: RecipeInput): Recipe

    # RecipeComments
    sendCommentRecipe(
      recipeUrl: String!
      input: CommentsRecipeInput
    ): CommentsRecipe
    voteCommentRecipe(_id: ID!, input: CommentsRecipeInput): CommentsRecipe
    editCommentRecipe(_id: ID!, input: CommentsRecipeInput): CommentsRecipe
  }
`;

export default recipeTypeDefs;
