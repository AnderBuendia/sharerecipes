import { ApolloError } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '@Modules/user/domain/models/user.model';
import { VOHashedPassword } from '@Shared/domain/value-objects/hashed-password.vo';
import { VOUuid } from '@Shared/domain/value-objects/uuid.vo';
import { VOUserName } from '@Shared/domain/value-objects/name.vo';
import { VOEmail } from '@Shared/domain/value-objects/email.vo';
import { FRONT_URL, EMAIL_CODE } from '@Shared/utils/constants';
import type { UserRepositoryInterface } from '@Modules/user/infrastructure/repository/user-mongo.repository.interface';
import type { CreateUserDTO } from '@Modules/user/infrastructure/graphql/dto/user.dto';
import { UserErrors } from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';
import { MailContent } from '@Shared/infrastructure/enums/mail-content.enum';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(input: CreateUserDTO) {
    const { name, email, password } = input;

    try {
      const existingUser = await this.userRepository.findUserByEmail(email);

      if (existingUser)
        throw new ApolloError(
          UserErrors.REGISTERED,
          HTTPStatusCodes.NOT_AUTHORIZED
        );

      const normalizeUser = {
        _id: new VOUuid(uuidv4()),
        name: new VOUserName(name),
        email: new VOEmail(email),
        password: await VOHashedPassword.createFromPlainText(password),
      };

      const user = UserModel.create(normalizeUser);

      await this.userRepository.createUser(user);

      const token = this.userRepository.generateToken(
        user._id.value,
        EMAIL_CODE
      );

      const mailContent = {
        url: `${FRONT_URL}/confirmation/${token}`,
        text: MailContent.ACTIVATE_ACCOUNT,
      };

      this.userRepository.sendMail(user.email.value, mailContent);

      return { success: true, token };
    } catch (error) {
      throw error;
    }
  }
}
