import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import { GET_USERS } from '@Lib/graphql/user/query';
import { DELETE_USER } from '@Lib/graphql/user/mutation';

export default function useDeleteUser({ offset, limit, email }) {
  const { addToast } = useToasts();
  const [deleteUser] = useMutation(DELETE_USER, {
    update(cache) {
      const { getUsers } = cache.readQuery({
        query: GET_USERS,
        variables: { offset, limit },
      });

      cache.writeQuery({
        query: GET_USERS,
        data: {
          getUsers: getUsers.users.filter(
            (currentUser) => currentUser.email !== email
          ),
        },
      });
    },
  });

  const setDeleteUser = useCallback(async ({ email }) => {
    try {
      const { data } = await deleteUser({
        variables: { email },
      });

      return data;
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  }, []);

  return { setDeleteUser };
}
