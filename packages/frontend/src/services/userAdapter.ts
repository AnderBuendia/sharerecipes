import { useQuery, useMutation } from '@apollo/client';
import { useUserStorage } from '@Services/storageAdapter';
import { FIND_USERS } from '@Lib/graphql/user/query.gql';
import {
  CREATE_USER,
  FORGOT_USER_PASSWORD,
  RESET_USER_PASSWORD,
  UPDATE_USER_PASSWORD,
  UPDATE_USER,
  DELETE_USER,
} from '@Lib/graphql/user/mutation.gql';
import { UserService } from '@Interfaces/ports/user.interface';
import type { UserProfile } from '@Interfaces/domain/user.interface';
import type { AuthState } from '@Interfaces/domain/auth.interface';
import type { QueryDataFindUsers } from '@Types/apollo/query/user.type';

export function useUser(): UserService {
  const { setAuth } = useUserStorage();

  const findUsers = ({ offset, limit }: { offset: number; limit: number }) => {
    return useQuery(FIND_USERS, {
      fetchPolicy: 'cache-and-network',
      variables: { offset, limit },
    });
  };

  const setCreateUser = () => {
    return useMutation(CREATE_USER);
  };

  const setUpdateUser = () => {
    return useMutation(UPDATE_USER, {
      onCompleted: ({ update_user: response }) => {
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
  };

  const setDeleteUser = ({
    offset,
    limit,
    email,
  }: {
    offset: number;
    limit: number;
    email: UserProfile['email'];
  }) => {
    return useMutation(DELETE_USER, {
      update(cache) {
        const queryData = cache.readQuery<QueryDataFindUsers>({
          query: FIND_USERS,
          variables: { offset, limit },
        });

        if (queryData) {
          cache.writeQuery({
            query: FIND_USERS,
            variables: { offset, limit },
            data: {
              find_users: {
                ...queryData.find_users,
                users: queryData.find_users.users.filter(
                  (currentUser) => currentUser.email !== email
                ),
              },
            },
          });
        }
      },
    });
  };

  const setForgotUserPassword = () => {
    return useMutation(FORGOT_USER_PASSWORD);
  };

  const setResetUserPassword = () => {
    return useMutation(RESET_USER_PASSWORD);
  };

  const setUpdateUserPassword = () => {
    return useMutation(UPDATE_USER_PASSWORD);
  };

  return {
    findUsers,
    setCreateUser,
    setUpdateUser,
    setDeleteUser,
    setForgotUserPassword,
    setResetUserPassword,
    setUpdateUserPassword,
  };
}
