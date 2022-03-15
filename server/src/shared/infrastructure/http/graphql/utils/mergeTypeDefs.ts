import { gql } from 'apollo-server-express';
import commentTypeDefs from '@Modules/comment/infrastructure/graphql/comment.type-defs';
import recipeTypeDefs from '@Modules/recipe/infrastructure/graphql/recipe.type-defs';
import userTypeDefs from '@Modules/user/infrastructure/graphql/user.type-defs';

/* Common types */
const baseTypeDefs = gql`
  type Query

  type Mutation
`;

const typeDefs = [baseTypeDefs, commentTypeDefs, userTypeDefs, recipeTypeDefs];

export default typeDefs;
