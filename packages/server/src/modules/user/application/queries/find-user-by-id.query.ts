import { ApolloError } from 'apollo-server-express';
import type { UserRepositoryInterface } from '@Modules/user/infrastructure/repository/user-mongo.repository.interface';
import { UserErrors } from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export class FindUserByIdQuery {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(ctxUserId?: string) {
    try {
      if (!ctxUserId)
        throw new ApolloError(
          UserErrors.NOT_LOGGED_IN,
          HTTPStatusCodes.NOT_AUTHORIZED
        );

      const existingUser = await this.userRepository.findUserById(ctxUserId);

      if (!existingUser)
        throw new ApolloError(
          UserErrors.USER_NOT_FOUND,
          HTTPStatusCodes.NOT_FOUND
        );

      const user = this.userRepository.toDTO(existingUser);

      return user;
    } catch (error) {
      throw error;
    }
  }
}
