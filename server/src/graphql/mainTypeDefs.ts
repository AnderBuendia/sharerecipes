import { gql } from 'apollo-server-express';
import userTypeDefs from '@Graphql/user/typeDefs';
import recipesTypeDefs from '@Graphql/recipes/typeDefs';

/* Common types */
const baseTypeDefs = gql`
  type Query

  type Mutation
`;

const typeDefs = [baseTypeDefs, userTypeDefs, recipesTypeDefs];

export default typeDefs;
