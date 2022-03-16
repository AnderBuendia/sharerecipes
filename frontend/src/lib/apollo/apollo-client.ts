import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

let apolloClient: ApolloClient<NormalizedCacheObject>;
let globalJwt: string | undefined;

export const createApolloClient = (jwt?: string) => {
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

  return new ApolloClient<NormalizedCacheObject>({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Recipe: {
          fields: {
            comments: {
              keyArgs: false,
              merge(existing = [], incoming) {
                return [...incoming];
              },
            },
            voted: {
              merge(existing, incoming) {
                return [...incoming];
              },
            },
          },
        },
        Query: {
          fields: {
            find_recipe: {
              merge(existing, incoming) {
                return {
                  ...incoming,
                };
              },
            },
            find_recipes: {
              merge(existing = [], incoming) {
                return [...incoming];
              },
            },
            find_users: {
              merge(existing = [], incoming) {
                return { ...incoming };
              },
            },
          },
        },
      },
    }),
  });
};

export function initializeApollo(
  jwt?: string,
  lostAuth?: boolean,
  initialState?: NormalizedCacheObject
) {
  let _apolloClient: ApolloClient<NormalizedCacheObject> = apolloClient;

  if (!apolloClient || (jwt !== undefined && jwt !== globalJwt)) {
    _apolloClient = createApolloClient(jwt);
    globalJwt = jwt;
  } else if (lostAuth || !jwt) {
    _apolloClient = createApolloClient();
    globalJwt = undefined;
  }

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({
      ...existingCache,
      ...initialState,
    } as any);
  }

  apolloClient = _apolloClient;
  return _apolloClient;
}
