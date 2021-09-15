import { useState, useCallback, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import AuthContext from '@Lib/context/auth/authContext';
import { RestEndPoints } from '@Enums/paths/rest-endpoints';
import { AlertMessages } from '@Enums/config/messages';
import { GET_USERS } from '@Lib/graphql/user/query';
import {
  CREATE_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  UPDATE_USER,
  UPDATE_USER_PASSWORD,
} from '@Lib/graphql/user/mutation';

export default function useUser() {
  const [open, setOpen] = useState(false);
  const { authState, setAuth } = useContext(AuthContext);
  const { addToast } = useToasts();

  /* Apollo Mutations */
  const [newUser] = useMutation(CREATE_USER);
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);
  const [resetPassword] = useMutation(RESET_PASSWORD);
  const [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD);
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: ({ updateUser: response }) => {
      setAuth({
        ...authState,
        user: {
          ...authState.user,
          name: response.name,
        },
      });
    },
  });

  const getUsers = useCallback(({ offset, limit }) => {
    return useQuery(GET_USERS, {
      fetchPolicy: 'cache-and-network',
      variables: { offset, limit },
    });
  }, []);

  const setNewUser = useCallback(async ({ submitData }) => {
    const { name, email, password } = submitData;

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
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  }, []);

  const setUpdateUser = useCallback(async ({ submitData }) => {
    const { name, password } = submitData;
    try {
      await updateUser({
        variables: {
          input: {
            name,
            email: authState.user.email,
            password,
          },
        },
      });

      addToast(AlertMessages.PROFILE_UPDATED, { appearance: 'success' });
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  }, []);

  const setUpdateUserPassword = useCallback(async ({ submitData }) => {
    const { confirmPassword, password } = submitData;

    try {
      const { data } = await updateUserPassword({
        variables: {
          input: {
            email: authState.user.email,
            password,
            confirmPassword,
          },
        },
      });

      addToast(AlertMessages.PASSWORD_UPDATED, { appearance: 'success' });

      return data;
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  }, []);

  const setForgotPassword = useCallback(async ({ submitData }) => {
    const { email } = submitData;

    try {
      const { data } = await forgotPassword({
        variables: {
          input: {
            email,
          },
        },
      });

      addToast(AlertMessages.CHECK_ACTIVATION_MAIL, { appearance: 'success' });

      return data;
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  }, []);

  const setResetPassword = useCallback(async ({ submitData, token }) => {
    const { password } = submitData;

    try {
      const { data } = await resetPassword({
        variables: {
          input: {
            token,
            password,
          },
        },
      });

      addToast(AlertMessages.PASSWORD_UPDATED_LOGIN, { appearance: 'success' });

      return data;
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  }, []);

  const setImageUser = useCallback(
    ({ url }) => {
      const { filename, image_url } = url;

      setAuth({
        ...authState,
        user: {
          ...authState.user,
          image_url,
          image_name: filename,
        },
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
        user: null,
        jwt: null,
      });

      addToast(AlertMessages.LOGOUT, { appearance: 'info' });
    } catch (error) {
      addToast(error, { appearance: 'error' });
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
