import { ApolloError } from 'apollo-server-express';
import type { UserRepositoryInterface } from '@Modules/user/infrastructure/repository/user-mongo.repository.interface';
import { UserErrors } from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export class FindUsersQuery {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(offset: number, limit: number) {
    try {
      const existingUsers = await this.userRepository.findUsers(offset, limit);

      if (!existingUsers)
        throw new ApolloError(
          UserErrors.USERS_NOT_FOUND,
          HTTPStatusCodes.NOT_FOUND
        );

      const users = existingUsers.map((existingUser) =>
        this.userRepository.toDTO(existingUser)
      );
      const total = await this.userRepository.findNumberOfTotalUsers();

      return { users, total };
    } catch (error) {
      throw error;
    }
  }
}
