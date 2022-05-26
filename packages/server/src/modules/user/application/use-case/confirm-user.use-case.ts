import { ApolloError } from 'apollo-server-express';
import { VOBoolean } from '@Shared/domain/value-objects/boolean.vo';
import { UserModel } from '@Modules/user/domain/models/user.model';
import { EMAIL_CODE } from '@Shared/utils/constants';
import type { UserRepositoryInterface } from '@Modules/user/infrastructure/repository/user-mongo.repository.interface';
import type { ConfirmUserDTO } from '@Modules/user/infrastructure/graphql/dto/user.dto';
import { UserErrors } from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export class ConfirmUserUseCase {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(input: ConfirmUserDTO) {
    const { token } = input;

    try {
      const verifiedUser = this.userRepository.verifyToken(token, EMAIL_CODE);

      const existingUser = await this.userRepository.findUserById(verifiedUser);

      if (!existingUser)
        throw new ApolloError(
          UserErrors.REGISTERED,
          HTTPStatusCodes.NOT_AUTHORIZED
        );

      const normalizeUser = {
        ...existingUser,
        confirmed: new VOBoolean(true),
      };

      const user = UserModel.update(normalizeUser);

      await this.userRepository.updateUser(user);

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}
