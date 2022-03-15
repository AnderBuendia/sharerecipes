import { ApolloError } from 'apollo-server-express';
import type { UserRepositoryInterface } from '@Modules/user/infrastructure/repository/user-mongo.repository.interface';
import type { ForgotUserPasswordDTO } from '@Modules/user/infrastructure/graphql/dto/user.dto';
import { FRONT_URL, FORGOT_USER_PASSWORD_CODE } from '@Shared/utils/constants';
import { UserErrors } from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';
import { MailContent } from '@Shared/infrastructure/enums/mail-content.enum';

export class ForgotUserPasswordUseCase {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(input: ForgotUserPasswordDTO) {
    const { email } = input;

    try {
      const user = await this.userRepository.findUserByEmail(email);

      if (!user) {
        return new ApolloError(
          UserErrors.EMAIL_NOT_FOUND,
          HTTPStatusCodes.NOT_FOUND
        );
      }

      const token = this.userRepository.generateToken(
        user._id.value,
        FORGOT_USER_PASSWORD_CODE
      );

      const mailContent = {
        url: `${FRONT_URL}/forgot-password/${token}`,
        text: MailContent.CHANGE_PASSWORD,
      };

      this.userRepository.sendMail(email, mailContent);

      return { success: true, token };
    } catch (error) {
      throw error;
    }
  }
}
