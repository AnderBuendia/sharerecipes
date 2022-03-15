import _ from 'lodash';
import commentResolvers from '@Modules/comment/infrastructure/graphql/comment.resolver';
import recipeResolvers from '@Modules/recipe/infrastructure/graphql/recipe.resolver';
import userResolvers from '@Modules/user/infrastructure/graphql/user.resolver';

const resolvers = _.merge({}, commentResolvers, userResolvers, recipeResolvers);

export default resolvers;
