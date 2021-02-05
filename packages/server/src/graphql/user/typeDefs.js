const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # Types
    type User {
        id: ID
        name: String
        email: String
        role: String
        image_url: String
        image_name: String
        createdAt: String
        confirmed: Boolean
        confirmpassword: String
        
    }

    type UserLogin {
        user: User
        token: String
    }

    type Users {
        users: [User]
        total: Int
    }

    type Message {
        message: String
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
        email: String
        password: String
        confirmpassword: String
        token: String
    }

    input AuthenticateInput {
        email: String!
        password: String!
    }

    # Queries
    extend type Query {
        # Users
        getUser: User
        getUsers(offset: Int, limit: Int): Users
    }

    # Mutations
    extend type Mutation {
        # Users
        newUser(input: UserInput): Boolean
        authenticateUser(input: AuthenticateInput): UserLogin
        updateUser(input: UserInput): User
        updateUserPassword(input: UserPasswordInput): Boolean
        deleteUser(id: ID!): Boolean

        # Confirm User
        confirmUser(input: TokenInput): Boolean
    
        # Recovery Password
        forgotPassword(input: EmailInput): Boolean
        resetPassword(input: UserPasswordInput): Boolean
    }
`;

module.exports = typeDefs;