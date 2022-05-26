import { ApolloError } from 'apollo-server-express';
import { UserModel } from '@Modules/user/domain/models/user.model';
import { VOUserName } from '@Shared/domain/value-objects/name.vo';
import { VOHashedPassword } from '@Shared/domain/value-objects/hashed-password.vo';
import type { UserRepositoryInterface } from '@Modules/user/infrastructure/repository/user-mongo.repository.interface';
import type { UpdateUserDTO } from '@Modules/user/infrastructure/graphql/dto/user.dto';
import {
  CommonErrors,
  UserErrors,
} from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(input: UpdateUserDTO, ctxUserId?: string) {
    const { email, password, name, confirmPassword } = input;

    try {
      if (!ctxUserId)
        throw new ApolloError(
          UserErrors.NOT_LOGGED_IN,
          HTTPStatusCodes.NOT_AUTHORIZED
        );

      const existingUser = await this.userRepository.findUserByEmail(email);

      if (!existingUser) {
        throw new ApolloError(
          UserErrors.USER_NOT_FOUND,
          HTTPStatusCodes.NOT_FOUND
        );
      } else if (ctxUserId !== existingUser._id.value) {
        throw new ApolloError(
          CommonErrors.INVALID_CREDENTIALS,
          HTTPStatusCodes.NOT_AUTHORIZED
        );
      }

      await this.userRepository.checkPassword(existingUser, password);

      const updatedName = name ? new VOUserName(name) : existingUser.name;
      const updatedPassword = confirmPassword
        ? await VOHashedPassword.createFromPlainText(input.confirmPassword)
        : existingUser.password;

      const normalizeUser = {
        ...existingUser,
        name: updatedName,
        password: updatedPassword,
      };

      const domainUser = UserModel.update(normalizeUser);

      await this.userRepository.updateUser(domainUser);

      const user = this.userRepository.toDTO(domainUser);

      return user;
    } catch (error) {
      throw error;
    }
  }
}
