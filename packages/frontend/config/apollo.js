import React from 'react';
import Head from 'next/head';
import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import cookie from "cookie";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";
import { offsetLimitPagination } from '@apollo/client/utilities';
import { getAccessToken, setAccessToken } from '../lib/accessToken';

const isServer = () => typeof window === 'undefined';

export function withApollo(PageComponent, { ssr = true } = {}) {
    const WithApollo = ({
        apolloClient,
        serverAccessToken,
        apolloState,
        ...pageProps
    }) => {
    if (!isServer() && !getAccessToken()) {
        setAccessToken(serverAccessToken);
    }
    const client = apolloClient || initApolloClient(apolloState);
        return <PageComponent {...pageProps} apolloClient={client} />;
    };

    if (process.env.NODE_ENV !== "production") {
        /* Find correct display name */
        const displayName =
          PageComponent.displayName || PageComponent.name || "Component";
    
        /* Warn if old way of installing apollo is used */
        if (displayName === "App") {
          console.warn("This withApollo HOC only works with PageComponents.");
        }
    
        /* Set correct display name for devtools */
        WithApollo.displayName = `withApollo(${displayName})`;
    }

    if (ssr || PageComponent.getInitialProps) {
        WithApollo.getInitialProps = async (context) => {
            const { AppTree, ctx } = context;
    
            let serverAccessToken = "";
            if (isServer()) {
                const cookies = ctx.req.headers.cookie ? cookie.parse(ctx.req.headers.cookie) : '';
                if (cookies.jid) {
                    const response = await fetch("http://localhost:4000/refresh_token", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        cookie: "jid=" + cookies.jid
                    }});
                    ctx.res.setHeader(
                        'Set-Cookie',
                        response.headers.get('set-cookie') ?? ''
                    );
                    const data = await response.json();
                    serverAccessToken = data.accessToken;
                }
            }
    
            /* Run all GraphQL queries in the component tree
            *  and extract the resulting data */
            const apolloClient = (context.ctx.apolloClient = initApolloClient(
                {},
                serverAccessToken
            ));
    
            const pageProps = PageComponent.getInitialProps
                ? await PageComponent.getInitialProps(ctx)
                : {};

            /* Only on the server */
            if (typeof window === "undefined") {
                /* When redirecting, the response is finished.
                *  No point in continuing to render */
                if (ctx.res && ctx.res.finished) {
                    return {};
                }
        
                if (ssr) {
                try {
                    /* Run all GraphQL queries */
                    const { getDataFromTree } = await import("@apollo/client/react/ssr");
                    await getDataFromTree(
                    <AppTree
                        pageProps={{
                        ...pageProps,
                        apolloClient
                        }}
                        apolloClient={apolloClient}
                    />
                    );
                } catch (error) {
                    /* Prevent Apollo Client GraphQL errors from crashing SSR. */
                    console.error("Error while running `getDataFromTree`", error);
                }
                }
        
                /* getDataFromTree does not call componentWillUnmount
                *  head side effect therefore need to be cleared manually */
                Head.rewind();
            }
        
            /* Extract query data from the Apollo store */
            const apolloState = apolloClient.cache.extract();
        
            return {
                ...pageProps,
                apolloState,
                serverAccessToken,
            };
        };
    }
    return WithApollo;
}

let apolloClient;

/* Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser. */
function initApolloClient(initState, serverAccessToken) {
    /* Make sure to create a new client for every server-side request so that data
    *  isn't shared between connections (which would be bad) */
    if (isServer()) {
      return createApolloClient(initState, serverAccessToken);
    }
  
    // Reuse client on the client-side
    if (!apolloClient) {
      // setAccessToken(cookie.parse(document.cookie).test);
      apolloClient = createApolloClient(initState);
    }
  
    return apolloClient;
  }

function createApolloClient(initialState = {}, serverAccessToken, ctx) {
    const httpLink = createUploadLink({ 
        uri: 'http://localhost:4000/graphql',
        fetch,
        credentials: 'include'
    });

    const refreshLink = new TokenRefreshLink({
        accessTokenField: "accessToken",
        isTokenValidOrUndefined: () => {
            const token = getAccessToken();
        
            if (!token) {
                return true;
            }
        
            try {
                const { exp } = jwtDecode(token);
                if (Date.now() >= exp * 1000) {
                return false;
                } else {
                return true;
                }
            } catch {
                return false;
            }
        },
        fetchAccessToken: () => {
                return fetch("http://localhost:4000/refresh_token", {
                method: "POST",
                credentials: 'include',
            });  
        },
        handleFetch: (accessToken) => {
            setAccessToken(accessToken);
        },
        handleError: err => {
            console.warn("Your refresh token is invalid. Try to relogin");
            console.error(err);
        }
    });
   
    const authLink = setContext((_, {headers}) => {
        /* Read token */
        const accessToken = isServer() ? serverAccessToken : getAccessToken();

        return {
            headers: {
                ...headers,
                authorization: accessToken ? `bearer ${accessToken}` : ''
            }
        }
    });

    const errorLink = onError(({ graphQLErrors, networkError }) => {
        console.log(graphQLErrors);
        console.log(networkError);
    });

    return new ApolloClient({
        // connectToDevTools: true,
        ssrMode: typeof window === 'undefined',
        link: ApolloLink.from([refreshLink, authLink, errorLink, httpLink]),
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
                Query: {
                    fields: {
                        getRecipe: {
                            merge(existing, incoming) {
                                return incoming;
                            }
                        }
                    }
                }
            }
        }).restore(initialState), 
    });
}