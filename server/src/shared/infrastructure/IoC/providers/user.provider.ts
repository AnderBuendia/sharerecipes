import { asClass, AwilixContainer } from 'awilix';
import { UserRepository } from '@Modules/user/infrastructure/repository/user-mongo.repository';
import { ICradle } from '@Shared/rest/interfaces/cradle.interface';
import { UserModel } from '@Modules/user/domain/models/user.model';
import { FindUserByIdQuery } from '@Modules/user/application/queries/find-user-by-id.query';
import { FindUsersQuery } from '@Modules/user/application/queries/find-users.query';
import { CreateUserUseCase } from '@Modules/user/application/use-case/create-user.use-case';
import { AuthenticateUserUseCase } from '@Modules/user/application/use-case/auth-user.use-case';
import { UpdateUserUseCase } from '@Modules/user/application/use-case/update-user.use-case';
import { DeleteUserUseCase } from '@Modules/user/application/use-case/delete-user.use-case';
import { ConfirmUserUseCase } from '@Modules/user/application/use-case/confirm-user.use-case';
import { ResetUserPasswordUseCase } from '@Modules/user/application/use-case/reset-user-password.use-case';
import { ForgotUserPasswordUseCase } from '@Modules/user/application/use-case/forgot-user-password.use-case';

export interface IUserProvider {
  findUserByIdQuery: FindUserByIdQuery;
  findUsersQuery: FindUsersQuery;
  authUserUseCase: AuthenticateUserUseCase;
  createUserUseCase: CreateUserUseCase;
  updateUserUseCase: UpdateUserUseCase;
  deleteUserUseCase: DeleteUserUseCase;
  confirmUserUseCase: ConfirmUserUseCase;
  resetUserPasswordUseCase: ResetUserPasswordUseCase;
  forgotUserPasswordUseCase: ForgotUserPasswordUseCase;
  userModel: UserModel;
  userRepository: UserRepository;
}

const userProvider = (container: AwilixContainer<ICradle>): void => {
  // Register the classes
  container.register({
    findUsersQuery: asClass(FindUsersQuery),
    findUserByIdQuery: asClass(FindUserByIdQuery),
    createUserUseCase: asClass(CreateUserUseCase),
    authUserUseCase: asClass(AuthenticateUserUseCase),
    updateUserUseCase: asClass(UpdateUserUseCase),
    deleteUserUseCase: asClass(DeleteUserUseCase),
    confirmUserUseCase: asClass(ConfirmUserUseCase),
    resetUserPasswordUseCase: asClass(ResetUserPasswordUseCase),
    forgotUserPasswordUseCase: asClass(ForgotUserPasswordUseCase),
    userRepository: asClass(UserRepository),
    userModel: asClass(UserModel).proxy(),
  });
};

export default userProvider;
