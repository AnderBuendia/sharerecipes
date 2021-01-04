const { gql } = require('apollo-server-express');
const userTypeDefs = require('./user/typeDefs');
const recipesTypeDefs = require('./recipes/typeDefs');

/* Common types */
const baseTypeDefs = gql`
    type Query

    type Mutation
`;

const typeDefs = [
    baseTypeDefs,
    userTypeDefs,
    recipesTypeDefs,
]; 

module.exports = typeDefs;