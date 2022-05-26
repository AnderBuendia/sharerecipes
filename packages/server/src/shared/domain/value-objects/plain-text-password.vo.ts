import { PrimitiveValueObject } from '@Shared/domain/value-objects/primitive-value-object';

/**
 * Plain text password value object
 */
export class VOPlainTextPassword extends PrimitiveValueObject<string> {
  /**
   * No needs to validate
   */
  protected validate() {
    return true;
  }
}
