import { compare, hash } from 'bcrypt';
import { passwordValidation } from '@Shared/utils/formValidation.utils';
import { VOFormatException } from '@Shared/domain/value-objects/vo-format.exception';
import { VOPlainTextPassword } from '@Shared/domain/value-objects/plain-text-password.vo';

/** Hash salt */
const HASH_SALT = 10;

export class VOHashedPassword {
  /** Password value */
  private _value: string;

  /**
   * Creates a new password value object
   * @param hashedPassword Hashed password
   */
  private constructor(hashedPassword: string) {
    this._value = hashedPassword;
  }

  /**
   * Value getter
   * @returns Current value
   */
  get value(): string {
    return this._value;
  }

  /**
   * Compare if a password is equals to a given password value object
   * @param password Password value object
   */
  public static async comparePassword(
    password: string,
    hashedPassword: VOHashedPassword
  ): Promise<boolean> {
    return await compare(password, hashedPassword.value);
  }

  /**
   * Creates a new password from plain text string
   * @param plainPassword Plain text password
   * @returns Password value object
   */
  public static async createFromPlainText(
    plainPassword: string
  ): Promise<VOHashedPassword> {
    if (!passwordValidation(plainPassword))
      throw new VOFormatException(plainPassword.replace(/.*/g, '*'));

    return new VOHashedPassword(await hash(plainPassword, HASH_SALT));
  }

  /**
   * Creates a new password from a hash
   * @param hashedPassword Hashed password
   * @returns Password value object
   */
  public static createFromHash(hashedPassword: string): VOHashedPassword {
    return new VOHashedPassword(hashedPassword);
  }
}
