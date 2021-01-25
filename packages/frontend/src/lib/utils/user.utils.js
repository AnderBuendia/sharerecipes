import { gql } from '@apollo/client';

const GET_USER = gql`
    query getUser {
        getUser {
            id
            name
            email
            role
            image_url
            image_name
            confirmed
        }
    }
`;

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