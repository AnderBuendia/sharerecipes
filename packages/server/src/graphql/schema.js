const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # Types

    type User {
        id: ID
        name: String
        email: String
        password: String
        confirmed: Boolean
        createdAt: String
        role: String
        image_url: String
        image_name: String
        confirmpassword: String
    }

    type Users {
        users: [User]
        total: Int
    }

    type Token {
        token: String
    }

    type Message {
        message: String
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
        comments(offset: Int, limit: Int): [CommentsRecipe]
        votes: Float
        voted: [String]
        average_vote: Float
        author: User
        createdAt: String
    }

    type File {
        url: String
        fileName: String
    }

    type CommentsRecipe {
        id: ID
        message: String
        author: User
        recipe: Recipe
        createdAt: String
    }
    
    # Inputs

    input UserInput {
        name: String!
        email: String!
        password: String!
        role: String
        image_url: String
        image_name: String
    }

    input TokenInput {
        token: String
    }

    input EmailInput {
        email: String!
    }

    input UserPasswordInput {
        password: String
        confirmpassword: String
        token: String
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
        votes: Float
    }

    input CommentsRecipeInput {
        recipe: ID
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
        getUsers(offset: Int, limit: Int): Users
        getComments: [CommentsRecipe]

        # Recipes
        getRecipes: [Recipe]
        getUserRecipes: [Recipe]
        getRecipe(id: ID, offset: Int, limit: Int): Recipe
    }

    # Mutations
    
    type Mutation {
        # Users
        newUser(input: UserInput): User
        authenticateUser(input: AuthenticateInput): Token
        updateUser(id: ID!, input: UserInput): User
        updateUserPassword(id: ID!, input: UserPasswordInput): User
        deleteUser(id: ID!): String

        # Confirm User
        confirmUser(input: TokenInput): Message

        # Recipes
        newRecipe(input: RecipeInput): Recipe
        updateRecipe(id: ID!, input: RecipeInput): Recipe
        deleteRecipe(id: ID!): String
        sendCommentsRecipe(input: CommentsRecipeInput): CommentsRecipe
        updateVoteRecipe(id: ID!, input: RecipeInput): Recipe

        # Files
        uploadRecipeImage(file: Upload!): File
        uploadUserImage(file: Upload!): File

        # Recovery Password
        forgotPassword(input: EmailInput): Message
        resetPassword(input: UserPasswordInput): Message
    }
`;

module.exports = typeDefs;