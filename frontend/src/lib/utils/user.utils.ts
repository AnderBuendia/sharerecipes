import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { GET_USER } from '@Lib/graphql/user/query';
import { CONFIRM_USER } from '@Lib/graphql/user/mutation';

export const loadCurrentUserSSR = async (
  jwt: string,
  apolloClient: ApolloClient<NormalizedCacheObject>
) => {
  const response = await apolloClient.query({
    query: GET_USER,
    context: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
  });

  const user = response.data.getUser;

  if (!user) return;

  const authProps = {
    user,
    jwt,
  };

  return authProps;
};

export const checkActivationToken = async (token: string | string[]) => {
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
