import recipeResolvers from '@Graphql/recipes/resolvers';
import userResolvers from '@Graphql/user/resolvers';
import _ from 'lodash';

const resolvers = _.merge({}, userResolvers, recipeResolvers);

export default resolvers;
