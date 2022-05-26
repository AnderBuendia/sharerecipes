import type { Express } from 'express';
import type { Server } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core/dist/plugin/drainHttpServer';
import { handleApolloContext } from '@Shared/infrastructure/http/graphql/utils/graphqlContext';
import typeDefs from '@Shared/infrastructure/http/graphql/utils/mergeTypeDefs';
import resolvers from '@Shared/infrastructure/http/graphql/utils/mergeResolvers';
import { BACK_URL } from '@Shared/utils/constants';

export const initializeApolloServer = async (
  app: Express,
  httpServer: Server
) => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: handleApolloContext,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  console.log(`🚀 Server ready at ${BACK_URL}${apolloServer.graphqlPath}`);
};
