const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # Types
    type Recipe {
        id: ID
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
        id: ID
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
        getRecipes: [Recipe]
        getBestRecipes: [Recipe]
        getUserRecipes: [Recipe]
        getRecipe(recipeUrl: String!, offset: Int, limit: Int): Recipe

        # RecipeComments
        getNumberOfComments(recipeUrl: String!): [CommentsRecipe]
    }

    # Mutation
    extend type Mutation {
        newRecipe(input: RecipeInput): Recipe
        updateRecipe(id: ID!, input: RecipeInput): Recipe
        deleteRecipe(recipeUrl: String!): String
        updateVoteRecipe(recipeUrl: String!, input: RecipeInput): Recipe
    
        # RecipeComments
        sendCommentsRecipe(recipeUrl: String!, input: CommentsRecipeInput): CommentsRecipe
        voteCommentsRecipe(id: ID!, input: CommentsRecipeInput): CommentsRecipe
        editCommentsRecipe(id: ID!, input: CommentsRecipeInput): CommentsRecipe
    }
`;

module.exports = typeDefs;