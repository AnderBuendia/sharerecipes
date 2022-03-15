import http from 'http';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core/dist/plugin/drainHttpServer';
import { handleApolloContext } from '@Shared/infrastructure/http/graphql/utils/graphqlContext';
import typeDefs from '@Shared/infrastructure/http/graphql/utils/mergeTypeDefs';
import resolvers from '@Shared/infrastructure/http/graphql/utils/mergeResolvers';
import { PORT, BACK_URL, NODE_ENV } from '@Shared/utils/constants';

/* Apollo server */
export async function startApolloServer(app) {
  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: handleApolloContext,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  if (NODE_ENV !== 'test') {
    await new Promise<void>((resolve) =>
      httpServer.listen({ port: PORT }, resolve)
    );
  }

  console.log(`🚀 Server ready at ${BACK_URL}${apolloServer.graphqlPath}`);
}
