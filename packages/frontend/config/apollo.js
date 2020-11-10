import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';

// const httpLink = createHttpLink({
//     uri: 'http://localhost:4000/graphql',
//     fetch
// });

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

const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

export default client;