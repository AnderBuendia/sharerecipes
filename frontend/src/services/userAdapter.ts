import { useQuery, useMutation } from '@apollo/client';
import { UserService } from '@Interfaces/ports/user.interface';
import { useUserStorage } from '@Services/storageAdapter';
import { GET_USERS } from '@Lib/graphql/user/query';
import {
  CREATE_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  UPDATE_USER_PASSWORD,
  UPDATE_USER,
  DELETE_USER,
} from '@Lib/graphql/user/mutation';
import { UserProfile } from '@Interfaces/domain/user.interface';
import { AuthState } from '@Interfaces/domain/auth.interface';
import { QueryDataGetUsers } from '@Types/apollo/query/user.type';

export function useUser(): UserService {
  const { setAuth } = useUserStorage();

  const getUsers = ({ offset, limit }: { offset: number; limit: number }) => {
    return useQuery(GET_USERS, {
      fetchPolicy: 'cache-and-network',
      variables: { offset, limit },
    });
  };

  const setNewUser = () => {
    return useMutation(CREATE_USER);
  };

  const setUpdateUser = () => {
    return useMutation(UPDATE_USER, {
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
  };

  const setForgotPassword = () => {
    return useMutation(FORGOT_PASSWORD);
  };

  const setResetPassword = () => {
    return useMutation(RESET_PASSWORD);
  };

  const setUpdateUserPassword = () => {
    return useMutation(UPDATE_USER_PASSWORD);
  };

  return {
    getUsers,
    setNewUser,
    setUpdateUser,
    setDeleteUser,
    setForgotPassword,
    setResetPassword,
    setUpdateUserPassword,
  };
}
