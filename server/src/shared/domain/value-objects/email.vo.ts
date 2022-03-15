import { emailValidation } from '@Shared/utils/formValidation.utils';
import { PrimitiveValueObject } from '@Shared/domain/value-objects/primitive-value-object';

/**
 * Email value object
 */
export class VOEmail extends PrimitiveValueObject<string> {
  /**
   * Creates a email value object
   * @param value Email
   */
  constructor(value: string) {
    super(value.toLowerCase());
  }
  /**
   * Validate if a string is an email
   * @param value Email
   */
  protected validate(value: string) {
    return emailValidation(value);
  }
}
