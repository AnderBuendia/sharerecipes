import { ApolloError } from 'apollo-server-express';
import type { UserRepositoryInterface } from '@Modules/user/infrastructure/repository/user-mongo.repository.interface';
import type { AuthenticateUserDTO } from '@Modules/user/infrastructure/graphql/dto/user.dto';
import { UserErrors } from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';
import { TOKEN_CODE, TOKEN_EXPIRED_TIME } from '@Shared/utils/constants';

export class AuthenticateUserUseCase {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(input: AuthenticateUserDTO) {
    const { email, password } = input;

    const existingUser = await this.userRepository.findUserByEmail(email);

    if (!existingUser)
      throw new ApolloError(
        UserErrors.USER_NOT_FOUND,
        HTTPStatusCodes.NOT_FOUND
      );

    await this.userRepository.checkPassword(existingUser, password);

    await this.userRepository.authenticateUser(existingUser);

    const token = this.userRepository.generateToken(
      existingUser._id.value,
      TOKEN_CODE,
      TOKEN_EXPIRED_TIME
    );

    const user = this.userRepository.toDTO(existingUser);

    return { user, token };
  }
}
