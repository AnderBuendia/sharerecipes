import { UserEntity } from '@Shared/infrastructure/http/mongodb/interfaces/documents/user-document.interface';
import { VOUuid } from '@Shared/domain/value-objects/uuid.vo';
import { VOBoolean } from '@Shared/domain/value-objects/boolean.vo';
import { VOUserName } from '@Shared/domain/value-objects/name.vo';
import { VOEmail } from '@Shared/domain/value-objects/email.vo';
import { VOHashedPassword } from '@Shared/domain/value-objects/hashed-password.vo';

export class UserModel {
  public constructor(
    public _id: VOUuid,
    public name: VOUserName,
    public email: VOEmail,
    public password: VOHashedPassword,
    public image_url?: string,
    public image_name?: string,
    public confirmed?: VOBoolean,
    public role?: string
  ) {}

  static create(userData: UserModel) {
    const { _id, name, email, password } = userData;

    const user = new UserModel(_id, name, email, password);

    return user;
  }

  static update(userData: UserModel) {
    const {
      _id,
      name,
      email,
      password,
      image_url,
      image_name,
      confirmed,
      role,
    } = userData;

    const user = new UserModel(
      _id,
      name,
      email,
      password,
      image_url,
      image_name,
      confirmed,
      role
    );

    return user;
  }

  static build(userData: UserEntity) {
    const {
      _id,
      name,
      email,
      password,
      image_url,
      image_name,
      confirmed,
      role,
    } = userData;

    const user = new UserModel(
      new VOUuid(_id),
      new VOUserName(name),
      new VOEmail(email),
      VOHashedPassword.createFromHash(password),
      image_url,
      image_name,
      new VOBoolean(confirmed),
      role
    );

    return user;
  }
}
