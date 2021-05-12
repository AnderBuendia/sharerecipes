const recipesResolvers = require('./recipes/resolvers');
const userResolvers = require('./user/resolvers');
const _ = require('lodash');

const resolvers = _.merge(
    {},
    userResolvers,
    recipesResolvers,
);

module.exports = resolvers;