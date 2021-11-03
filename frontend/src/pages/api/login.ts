import { NextApiRequest, NextApiResponse } from 'next';
import { ApolloError } from '@apollo/client';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { setJwtCookie } from '@Lib/utils/jwt-cookie.utils';
import { HTTPStatusCodes } from '@Enums/config/http-status-codes.enum';
import { AlertMessages, FormMessages } from '@Enums/config/messages.enum';
import { AUTH_USER } from '@Lib/graphql/user/mutation';

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(HTTPStatusCodes.METHOD_NOT_ALLOWED).send(false);
    return;
  }

  const { email, password } = req.body;

  if (!email) {
    res.status(HTTPStatusCodes.BAD_REQUEST).send(FormMessages.EMAIL_REQUIRED);
    return;
  }

  if (!password) {
    res
      .status(HTTPStatusCodes.BAD_REQUEST)
      .send(FormMessages.PASSWORD_REQUIRED);
    return;
  }

  const apolloClient = createApolloClient();

  try {
    let response = await apolloClient.mutate({
      mutation: AUTH_USER,
      variables: {
        input: {
          email,
          password,
        },
      },
    });

    const token = response.data.authenticateUser.token;
    const user = response.data.authenticateUser.user;

    if (token && user) {
      setJwtCookie(res, token);
      res.status(HTTPStatusCodes.OK).json({ token, user });
    }
  } catch (error: any) {
    if (error instanceof ApolloError && error?.graphQLErrors[0]) {
      const graphQLError: number = error.graphQLErrors[0].extensions?.code;

      res.status(graphQLError).send({ error: error.message });
    } else {
      res
        .status(HTTPStatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: AlertMessages.SERVER_ERROR });
    }
  }
};

export default login;
