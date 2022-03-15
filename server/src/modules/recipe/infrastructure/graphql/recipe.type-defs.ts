import { gql } from 'apollo-server-express';

const recipeTypeDefs = gql`
  # Types
  type Recipe {
    _id: String
    name: String
    serves: Int
    ingredients: [String]
    prep_time: Int
    difficulty: RecipeDifficulty
    image_name: String
    image_url: String
    description: String
    style: String
    comments(offset: Int, limit: Int): [Comment]
    votes: Float
    voted: [String]
    average_vote: Float
    url_query: String
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
    prep_time: Int
    ingredients: [String]
    difficulty: RecipeDifficulty
    style: String
    description: String
    image_url: String
    image_name: String
  }

  input UpdateRecipeDTO {
    name: String
    serves: Int
    prep_time: Int
    ingredients: [String]
    difficulty: RecipeDifficulty
    style: String
    description: String
    image_url: String
    image_name: String
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

    find_recipes(sort: String, offset: Int, limit: Int): [Recipe]
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
