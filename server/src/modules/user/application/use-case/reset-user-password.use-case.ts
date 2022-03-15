import type { Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-express';
import { UserModel } from '@Modules/user/domain/models/user.model';
import { VOHashedPassword } from '@Shared/domain/value-objects/hashed-password.vo';
import { FORGOT_USER_PASSWORD_CODE } from '@Shared/utils/constants';
import type { UserRepositoryInterface } from '@Modules/user/infrastructure/repository/user-mongo.repository.interface';
import type { ResetUserPasswordDTO } from '@Modules/user/infrastructure/graphql/dto/user.dto';
import { UserErrors } from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export class ResetUserPasswordUseCase {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(input: ResetUserPasswordDTO, ctxResponse: Response) {
    const { token, password } = input;

    try {
      const verifiedUser = this.userRepository.verifyToken(
        token,
        FORGOT_USER_PASSWORD_CODE
      );

      const existingUser = await this.userRepository.findUserById(verifiedUser);

      if (!existingUser)
        throw new ApolloError(
          UserErrors.REGISTERED,
          HTTPStatusCodes.NOT_AUTHORIZED
        );

      const updatedPassword = await VOHashedPassword.createFromPlainText(
        password
      );

      const normalizeUser = {
        ...existingUser,
        password: updatedPassword,
      };

      const user = UserModel.update(normalizeUser);

      await this.userRepository.updateUser(user);

      return { success: true };
    } catch (error: any) {
      if (error instanceof TokenExpiredError) {
        return ctxResponse.json({
          status: 'Failure',
          msg: 'TOKEN_EXPIRED',
          details: {
            error: 'Sign in token expired',
          },
        });
      }

      throw error;
    }
  }
}
