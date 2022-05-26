import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { FIND_USER } from '@Lib/graphql/user/query.gql';
import { CONFIRM_USER } from '@Lib/graphql/user/mutation.gql';

export const loadCurrentUserSSR = async (
  jwt: string,
  apolloClient: ApolloClient<NormalizedCacheObject>
) => {
  const response = await apolloClient.query({
    query: FIND_USER,
    context: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
  });

  const user = response.data.find_user;

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

      if (data.confirm_user.success) return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};
