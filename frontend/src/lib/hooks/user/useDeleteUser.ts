import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import { GET_USERS } from '@Lib/graphql/user/query';
import { DELETE_USER } from '@Lib/graphql/user/mutation';
import { QueryDataGetUsers } from '@Types/apollo/query/user.type';

export default function useDeleteUser({
  offset,
  limit,
  email,
}: {
  offset: number;
  limit: number;
  email: string;
}) {
  const { addToast } = useToasts();
  const [deleteUser] = useMutation(DELETE_USER, {
    update(cache) {
      const queryData = cache.readQuery<QueryDataGetUsers>({
        query: GET_USERS,
        variables: { offset, limit },
      });

      if (queryData) {
        cache.writeQuery({
          query: GET_USERS,
          data: {
            ...queryData,
            getUsers: queryData.getUsers.users.filter(
              (currentUser) => currentUser.email !== email
            ),
          },
        });
      }
    },
  });

  const setDeleteUser = useCallback(async ({ email }: { email: string }) => {
    try {
      const { data } = await deleteUser({
        variables: { email },
      });

      return data;
    } catch (error) {
      if (error instanceof Error) {
        addToast(error.message.replace('GraphQL error: ', ''), {
          appearance: 'error',
        });
      }
    }
  }, []);

  return { setDeleteUser };
}
