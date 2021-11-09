import { QueryResult, MutationTuple, OperationVariables } from '@apollo/client';
import { UserProfile } from '@Interfaces/domain/user.interface';

export interface UserService {
  getUsers: ({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }) => QueryResult<
    any,
    {
      offset: number;
      limit: number;
    }
  >;

  setNewUser: () => MutationTuple<any, OperationVariables>;
  setUpdateUser: () => MutationTuple<any, OperationVariables>;
  setDeleteUser: ({
    offset,
    limit,
    email,
  }: {
    offset: number;
    limit: number;
    email: UserProfile['email'];
  }) => MutationTuple<any, OperationVariables>;

  setForgotPassword: () => MutationTuple<any, OperationVariables>;
  setResetPassword: () => MutationTuple<any, OperationVariables>;
  setUpdateUserPassword: () => MutationTuple<any, OperationVariables>;
}
