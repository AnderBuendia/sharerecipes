const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # Types

    type User {
        id: ID
        name: String
        email: String
        password: String
        createdAt: String
        confirmpassword: String
        role: String
    }

    type Token {
        token: String
    }

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
        comments: [CommentsRecipeGroup]
        author: ID
    }

    type File {
        url: String
        fileName: String
    }

    type CommentsRecipeGroup {
        user_id: ID
        user_name: String
        message: String
    }
    
    # Inputs

    input UserInput {
        name: String!
        email: String!
        password: String!
        role: String
    }

    input UserPasswordInput {
        password: String
        confirmpassword: String
    }

    input AuthenticateInput {
        email: String!
        password: String!
    }

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
        comments: CommentsRecipeInput
    }

    input CommentsRecipeInput {
        user_id: ID
        user_name: String
        message: String
    }

    enum RecipeDifficulty {
        EASY
        MEDIUM
        HARD
    }

    # Queries
    
    type Query {
        # Users
        getUser: User
        getUsers: [User]

        # Recipes
        getRecipes: [Recipe]
        getUserRecipes: [Recipe]
        getRecipe(id: ID!): Recipe

    }

    # Mutations
    
    type Mutation {
        # Users
        newUser(input: UserInput): User
        authenticateUser(input: AuthenticateInput): Token
        updateUser(id: ID!, input: UserInput): User
        updateUserPassword(id: ID!, input: UserPasswordInput): User
        deleteUser(id: ID!): String

        # Recipes
        newRecipe(input: RecipeInput): Recipe
        updateRecipe(id: ID!, input: RecipeInput): Recipe
        deleteRecipe(id: ID!): String
        updateCommentsRecipe(id: ID!, input: RecipeInput): Recipe

        # Files
        uploadFile(file: Upload!): File
    }
`;

module.exports = typeDefs;