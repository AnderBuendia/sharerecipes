const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # Types
    type File {
        url: String
        fileName: String
    }

    # Mutation
    extend type Mutation {
        # Files
        uploadRecipeImage(file: Upload!): File
        uploadUserImage(file: Upload!): File
    }
`;

module.exports = typeDefs;