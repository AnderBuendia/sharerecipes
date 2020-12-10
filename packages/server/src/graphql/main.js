const { gql } = require('apollo-server-express');
const _ = require('lodash');
const userTypeDefs = require('./user/typeDefs');
const userResolvers = require('./user/resolvers');
const recipesTypeDefs = require('./recipes/typeDefs');
const recipesResolvers = require('./recipes/resolvers');
const otherTypeDefs = require('./other/typeDefs');
const otherResolvers = require('./other/resolvers');

/* Common types */
const baseTypeDefs = gql`
    type Query

    type Mutation
`;

const mainGraphQL = () => {
    const typeDefs = [
        baseTypeDefs,
        userTypeDefs,
        otherTypeDefs,
        recipesTypeDefs,
    ]; 

    const resolvers = _.merge(
        {},
        userResolvers,
        recipesResolvers,
        otherResolvers 
    );

    return { typeDefs, resolvers }
}

module.exports = mainGraphQL;