import { createApolloClient } from '@Lib/apollo/apollo-client';
import { GET_USER } from '@Lib/graphql/user/query';
import { CONFIRM_USER } from '@Lib/graphql/user/mutation';

export const loadCurrentUserSSR = async (jwt, apolloClient) => {
  const response = await apolloClient.query({
    query: GET_USER,
    context: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
  });

  const user = response.data.getUser;

  if (!user) return;

  const { _id, name, email, role, image_url, image_name, confirmed } = user;

  const authProps = {
    user: {
      _id,
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

export const checkActivationToken = async (token) => {
  const apolloClient = createApolloClient();

  try {
    if (typeof token === 'string') {
      const { data } = await apolloClient.mutate({
        mutation: CONFIRM_USER,
        variables: {
          input: { token },
        },
      });

      if (data.confirmUser) return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};
