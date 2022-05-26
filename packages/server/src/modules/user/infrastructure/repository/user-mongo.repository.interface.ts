import type { UserModel } from '@Modules/user/domain/models/user.model';
import type { UserEntity } from '@Shared/infrastructure/http/mongodb/interfaces/documents/user-document.interface';
import type {
  PublicUserDTO,
  SendMailUserDTO,
} from '@Modules/user/infrastructure/graphql/dto/user.dto';

export interface UserRepositoryInterface {
  toDomain(persistentEntity: PublicUserDTO): UserModel;

  toDTO(domainEntity: UserModel): PublicUserDTO;

  toPersistence(domainEntity: UserModel): UserEntity;

  generateToken(userId: string, code: string, time?: string): string;

  verifyToken(token: string, code: string): string;

  checkPassword(user: UserModel, password: string): Promise<void>;

  sendMail(email: string, mailContent: SendMailUserDTO): void;

  findUserById(id: string): Promise<UserModel | undefined>;

  findUserByEmail(email: string): Promise<UserModel | undefined>;

  findUsers(offset: number, limit: number): Promise<UserModel[] | undefined>;

  findNumberOfTotalUsers(): Promise<number>;

  createUser(user: UserModel): Promise<void>;

  authenticateUser(user: UserModel): Promise<void>;

  updateUser(user: UserModel): Promise<void>;

  deleteUser(user: UserModel): Promise<void>;
}
