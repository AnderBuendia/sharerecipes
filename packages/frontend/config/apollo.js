import { useMemo } from 'react';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { getAccessToken } from '../lib/accessToken';

let apolloClient;

function createIsomorphLink() {
    if (typeof window === 'undefined') {
        return null;
    } else {
        const httpLink = createHttpLink({ 
            uri: 'http://localhost:4000/graphql',
            credentials: 'include',
        });

        const authLink = setContext((_, {headers}) => {
            /* Read token */
            const accessToken = getAccessToken();
            
            return {
                headers: {
                    ...headers,
                    authorization: accessToken ? `bearer ${accessToken}` : ''
                }
            }
        });

        return authLink.concat(httpLink);
    }
}

function createApolloClient() {
    return new ApolloClient({
        connectToDevTools: true,
        ssrMode: typeof window === 'undefined',
        link: createIsomorphLink(),
        cache: new InMemoryCache({
            typePolicies: {
                Recipe: {
                    fields: {
                        comments: offsetLimitPagination(), 
                        keyArgs: false,
                        voted: {
                            merge(existing, incoming) {
                                return incoming;
                            }
                        },   
                    }
                },
            }
        }), 
    })
}

export function initializeApollo(initialState = null, ctx = null) {
    const _apolloClient = apolloClient ?? createApolloClient(ctx);

    if (initialState) {
        // const existingCache = _apolloClient.extract();
        _apolloClient.cache.restore(initialState);
    }

    if (typeof window === 'undefined') return _apolloClient;

    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}

export function useApollo(initialState, ctx = null) {
    const store = useMemo(() => initializeApollo(initialState, ctx), [
        initialState,
        ctx
    ]);
    return store;
}
