const otherResolvers = require('./other/resolvers');
const recipesResolvers = require('./recipes/resolvers');
const userResolvers = require('./user/resolvers');
const _ = require('lodash');

const resolvers = _.merge(
    {},
    userResolvers,
    recipesResolvers,
    otherResolvers 
);

module.exports = resolvers;