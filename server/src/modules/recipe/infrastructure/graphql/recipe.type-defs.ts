import { gql } from 'apollo-server-express';

const recipeTypeDefs = gql`
  # Types
  type Recipe {
    _id: String
    name: String
    serves: Int
    ingredients: [String]
    prepTime: Int
    difficulty: RecipeDifficulty
    imageName: String
    imageUrl: String
    description: String
    style: String
    comments(offset: Int, limit: Int): [Comment]
    votes: Float
    voted: [String]
    averageVote: Float
    urlQuery: String
    author: User
    createdAt: String
  }

  # Payloads
  type DeleteRecipePayload {
    success: Boolean
  }

  # Inputs
  input CreateRecipeDTO {
    name: String
    serves: Int
    prepTime: Int
    ingredients: [String]
    difficulty: RecipeDifficulty
    style: String
    imageUrl: String
    imageName: String
    description: String
  }

  input UpdateRecipeDTO {
    name: String
    serves: Int
    prepTime: Int
    ingredients: [String]
    difficulty: RecipeDifficulty
    style: String
    imageUrl: String
    imageName: String
    description: String
  }

  input VoteRecipeDTO {
    votes: Int
  }

  enum RecipeDifficulty {
    EASY
    MEDIUM
    HARD
  }

  # Query
  extend type Query {
    find_recipe(recipeUrlQuery: String!, offset: Int, limit: Int): Recipe

    find_recipes(sort: String, query: String, offset: Int, limit: Int): [Recipe]
  }

  # Mutation
  extend type Mutation {
    create_recipe(input: CreateRecipeDTO): Recipe

    update_recipe(recipeUrlQuery: String!, input: UpdateRecipeDTO): Recipe

    delete_recipe(recipeId: String!): DeleteRecipePayload

    vote_recipe(recipeUrlQuery: String!, input: VoteRecipeDTO): Recipe
  }
`;

export default recipeTypeDefs;
