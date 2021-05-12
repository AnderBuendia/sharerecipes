import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { offsetLimitPagination } from '@apollo/client/utilities';

let apolloClient;
let globalJwt;

export const createApolloClient = (jwt = null) => {
  const authLink = setContext((_, { headers }) => {
    return jwt
      ? {
          headers: {
            ...headers,
            authorization: jwt ? `Bearer ${jwt}` : '',
          },
        }
      : { ...headers };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
            locations
          )}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GQL_URI,
    credentials: 'same-origin',
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Recipe: {
          fields: {
            comments: offsetLimitPagination(),
            keyArgs: false,
            voted: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
        Query: {
          fields: {
            getRecipe: {
              merge(existing, incoming) {
                return incoming;
              },
            },
            getRecipes: offsetLimitPagination(),
            getBestRecipes: offsetLimitPagination(),
          },
        },
      },
    }),
  });
};

export function initializeApollo(jwt = null, lostAuth, initialState = null) {
  let _apolloClient = apolloClient;

  if (!apolloClient || (jwt !== null && jwt !== globalJwt)) {
    _apolloClient = createApolloClient(jwt);
    globalJwt = jwt;
  } else if (lostAuth || !jwt) {
    _apolloClient = createApolloClient();
    globalJwt = null;
  }

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({
      ...existingCache,
      ...initialState,
    });
  }

  apolloClient = _apolloClient;
  return _apolloClient;
}
