import { User } from '@Shared/infrastructure/http/mongodb/schemas/user.schema';
import { ApolloError } from 'apollo-server-express';
import { UserModel } from '@Modules/user/domain/models/user.model';
import { sendEmails } from '@Shared/utils/sendEmails.utils';
import { signToken, verifyToken } from '@Shared/utils/auth.utils';
import { VOHashedPassword } from '@Shared/domain/value-objects/hashed-password.vo';
import { NODE_ENV } from '@Shared/utils/constants';
import type { UserEntity } from '@Shared/infrastructure/http/mongodb/interfaces/documents/user-document.interface';
import type { UserRepositoryInterface } from '@Modules/user/infrastructure/repository/user-mongo.repository.interface';
import type {
  PublicUserDTO,
  SendMailUserDTO,
} from '@Modules/user/infrastructure/graphql/dto/user.dto';
import { UserErrors } from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export class UserRepository implements UserRepositoryInterface {
  /**
   * Creates a domain entity from database entity
   * @param persistentEntity Database entity
   */
  toDomain(persistentEntity: UserEntity): UserModel {
    return UserModel.build(persistentEntity);
  }

  /**
   * Creates a Data Transfer Object from domain entity
   * @param domainEntity
   */
  toDTO(domainEntity: UserModel): PublicUserDTO {
    return {
      _id: domainEntity._id.value,
      name: domainEntity.name.value,
      email: domainEntity.email.value,
      imageUrl: domainEntity.imageUrl,
      imageName: domainEntity.imageName,
      confirmed: domainEntity.confirmed.value,
      role: domainEntity.role,
    };
  }

  /**
   * Creates a database entity from domain entity
   * @param domainEntity Domain entity
   */
  toPersistence(domainEntity: UserModel): UserEntity {
    return {
      _id: domainEntity._id.value,
      name: domainEntity.name.value,
      email: domainEntity.email.value,
      password: domainEntity.password.value,
      image_url: domainEntity.imageUrl,
      image_name: domainEntity.imageName,
      confirmed: domainEntity.confirmed?.value,
      role: domainEntity.role,
    };
  }

  /**
   * Generates a new JWT Token with user data
   * @param userId User's id
   * @param code Secret code
   * @param time Time until token expires
   */
  generateToken(userId: string, code: string, time?: string) {
    return signToken({
      _id: userId,
      code,
      time,
    });
  }

  /**
   * Verifies JWT Token
   * @param token Token code
   * @param code Secret code
   */
  verifyToken(token: string, code: string) {
    return verifyToken({ token, code });
  }

  /**
   * Check is user password is correct
   * @param User User
   * @param password Password that user introduce
   */
  async checkPassword(user: UserModel, password: string) {
    try {
      const isValidPassword = await VOHashedPassword.comparePassword(
        password,
        user.password
      );

      if (!isValidPassword) {
        throw new ApolloError(
          UserErrors.CURRENT_PASSWORD,
          HTTPStatusCodes.NOT_AUTHORIZED
        );
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send Mail to the user with information that is required
   * @param email User's email
   * @param mailContent Url to redirect and mail HTML content
   */
  sendMail(email: string, mailContent: SendMailUserDTO) {
    if (NODE_ENV !== 'test') {
      return sendEmails({ email, mailContent });
    }
  }

  /**
   * Finds a user by id
   * @param id User's id
   */
  async findUserById(id: string) {
    const user = await User.findById(id);

    if (!user) return null;

    return this.toDomain(user);
  }

  /**
   * Finds a user by email
   * @param email User's email
   */
  async findUserByEmail(email: string) {
    const user = await User.findOne({ email }).exec();

    if (!user) return null;

    return this.toDomain(user);
  }

  /**
   * Finds all existing users
   * @param offset Initial number to search
   * @param limit End number to search
   */
  async findUsers(offset: number, limit: number) {
    const users = await User.find({}).skip(offset).limit(limit).exec();

    if (!users) return null;

    return users.map((user) => this.toDomain(user));
  }

  /**
   * Finds the total number of users in database
   */
  async findNumberOfTotalUsers() {
    return await User.countDocuments({});
  }

  /**
   * Creates new user
   * @param user User
   */
  async createUser(user: UserModel) {
    const persistentUser = this.toPersistence(user);

    await User.create(persistentUser);
  }

  /**
   * Authenticates a user
   * @param user User
   * @param password User's password
   */
  async authenticateUser(user: UserModel) {
    try {
      if (!user.confirmed.value) {
        throw new ApolloError(
          UserErrors.NOT_ACTIVATED,
          HTTPStatusCodes.NOT_AUTHORIZED
        );
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates user data
   * @param user User
   */
  async updateUser(user: UserModel) {
    const persistentUser = this.toPersistence(user);

    await User.findByIdAndUpdate({ _id: user._id.value }, persistentUser);
  }

  /**
   * Deletes a user by email
   * @param user User
   */
  async deleteUser(user: UserModel) {
    await User.findOneAndDelete({ _id: user._id.value });
  }
}
