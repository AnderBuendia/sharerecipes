import { useMutation } from '@apollo/client';
import { createApolloClient } from '../apollo/apollo-client';
import { GET_USER } from '../graphql/user/query';
import { CONFIRM_USER } from '../../lib/graphql/user/mutation';

export const loadCurrentUserSSR = async (jwt, apolloClient) => {
    const response = await apolloClient.query({
        query: GET_USER,
        context: {
            headers: { Authorization: `Bearer ${jwt}` },
        }
    });

    const user = response.data.getUser;

    if (!user) return;

    const { 
        id, 
        name, 
        email, 
        role, 
        image_url, 
        image_name, 
        confirmed,
    } = user;

    const authProps = {
        user: {
            id,
            name,
            email,
            role,
            image_url,
            image_name,
            confirmed,
        },
        jwt,
    };

    return authProps;
};

export const checkActivationToken = async token => {
    const apolloClient = createApolloClient();

    try {
        if (typeof token === 'string') {
            const res = await apolloClient.mutate({
                mutation: CONFIRM_USER,
                variables: {
                    input: { token }
                }
            });

                if (res.data.confirmUser) return true;
            };

        return false;
    } catch (e) {
        return false;
    }
};