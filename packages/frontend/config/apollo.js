import { useMemo } from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { mergeDeep, offsetLimitPagination } from '@apollo/client/utilities';

let apolloClient;

function createIsomorphLink() {
    if (typeof window === 'undefined') {
        return null;
    } else {
        const httpLink = createUploadLink({ uri: 'http://localhost:4000/graphql' });

        const authLink = setContext((_, {headers}) => {
            /* Read storage token */
            const token = localStorage.getItem('token');
            return {
                headers: {
                    ...headers,
                    authorization: token ? `Bearer ${token}` : ''
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

export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient();

    if (initialState) {
        const existingCache = _apolloClient.extract();
        _apolloClient.cache.restore({ ...existingCache, ...initialState});
    }

    if (typeof window === 'undefined') return _apolloClient;

    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}

export function useApollo(initialState) {
    const store = useMemo(() => initializeApollo(initialState), [initialState]);
    return store;
}
