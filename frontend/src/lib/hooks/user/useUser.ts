import { useState, useCallback, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import AuthContext from '@Lib/context/AuthContext';
import { RestEndPoints } from '@Enums/paths/rest-endpoints.enum';
import { AlertMessages } from '@Enums/config/messages.enum';
import { GET_USERS } from '@Lib/graphql/user/query';
import {
  CREATE_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  UPDATE_USER,
  UPDATE_USER_PASSWORD,
} from '@Lib/graphql/user/mutation';
import { AuthState } from '@Interfaces/context/auth-context.interface';
import { UserImage } from '@Interfaces/auth/user.interface';

export default function useUser() {
  const [open, setOpen] = useState<boolean>(false);
  const { authState, setAuth } = useContext(AuthContext);
  const { addToast } = useToasts();

  /* Apollo Mutations */
  const [newUser] = useMutation(CREATE_USER);
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);
  const [resetPassword] = useMutation(RESET_PASSWORD);
  const [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD);
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: ({ updateUser: response }) => {
      setAuth((oldState: AuthState): AuthState => {
        if (oldState.user?.name !== response.name) {
          return {
            ...oldState,
            user: {
              ...oldState.user,
              name: response.name,
            },
          } as AuthState;
        }

        return oldState;
      });
    },
  });

  const getUsers = useCallback(
    ({ offset, limit }: { offset: number; limit: number }) => {
      return useQuery(GET_USERS, {
        fetchPolicy: 'cache-and-network',
        variables: { offset, limit },
      });
    },
    [useQuery]
  );

  const setNewUser = useCallback(
    async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      try {
        const { data } = await newUser({
          variables: {
            input: {
              name,
              email,
              password,
            },
          },
        });

        addToast(AlertMessages.USER_CREATED, { appearance: 'success' });

        return data;
      } catch (error) {
        if (error instanceof Error) {
          addToast(error.message.replace('GraphQL error: ', ''), {
            appearance: 'error',
          });
        }
      }
    },
    [newUser]
  );

  const setUpdateUser = useCallback(
    async ({ name, password }: { name: string; password: string }) => {
      try {
        await updateUser({
          variables: {
            input: {
              name,
              email: authState.user?.email,
              password,
            },
          },
        });

        addToast(AlertMessages.PROFILE_UPDATED, { appearance: 'success' });
      } catch (error) {
        if (error instanceof Error) {
          addToast(error.message.replace('GraphQL error: ', ''), {
            appearance: 'error',
          });
        }
      }
    },
    [updateUser]
  );

  const setUpdateUserPassword = useCallback(
    async ({
      password,
      confirmPassword,
    }: {
      password: string;
      confirmPassword: string;
    }) => {
      try {
        const { data } = await updateUserPassword({
          variables: {
            input: {
              email: authState.user?.email,
              password,
              confirmPassword,
            },
          },
        });

        addToast(AlertMessages.PASSWORD_UPDATED, { appearance: 'success' });

        return data;
      } catch (error) {
        if (error instanceof Error) {
          addToast(error.message.replace('GraphQL error: ', ''), {
            appearance: 'error',
          });
        }
      }
    },
    [updateUserPassword]
  );

  const setForgotPassword = useCallback(
    async ({ email }: { email: string }) => {
      try {
        const { data } = await forgotPassword({
          variables: {
            input: {
              email,
            },
          },
        });

        addToast(AlertMessages.CHECK_ACTIVATION_MAIL, {
          appearance: 'success',
        });

        return data;
      } catch (error) {
        if (error instanceof Error) {
          addToast(error.message.replace('GraphQL error: ', ''), {
            appearance: 'error',
          });
        }
      }
    },
    [forgotPassword]
  );

  const setResetPassword = useCallback(
    async ({ password, token }: { password: string; token: string }) => {
      try {
        const { data } = await resetPassword({
          variables: {
            input: {
              token,
              password,
            },
          },
        });

        addToast(AlertMessages.PASSWORD_UPDATED_LOGIN, {
          appearance: 'success',
        });

        return data;
      } catch (error) {
        if (error instanceof Error) {
          addToast(error.message.replace('GraphQL error: ', ''), {
            appearance: 'error',
          });
        }
      }
    },
    [resetPassword]
  );

  const setImageUser = useCallback(
    ({ image_name, image_url }: UserImage) => {
      setAuth((oldState: AuthState): AuthState => {
        if (
          oldState.user?.image_name !== image_name ||
          oldState.user?.image_url !== image_url
        ) {
          return {
            ...oldState,
            user: {
              ...oldState.user,
              image_url,
              image_name,
            },
          } as AuthState;
        }

        return oldState;
      });
    },
    [setAuth]
  );

  const signOut = useCallback(async () => {
    setOpen(false);

    try {
      await fetch(RestEndPoints.LOGOUT, {
        method: 'POST',
      });

      setAuth({
        user: undefined,
        jwt: undefined,
      });

      addToast(AlertMessages.LOGOUT, { appearance: 'info' });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        addToast(error, { appearance: 'error' });
      }

      return false;
    }
  }, [setAuth]);

  return {
    open,
    authState,
    getUsers,
    setOpen,
    setAuth,
    setNewUser,
    setUpdateUser,
    setUpdateUserPassword,
    setForgotPassword,
    setResetPassword,
    setImageUser,
    signOut,
  };
}
