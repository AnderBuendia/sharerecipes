import { PrimitiveValueObject } from '@Shared/domain/value-objects/primitive-value-object';

/**
 * Boolean value object
 */
export class VOBoolean extends PrimitiveValueObject<boolean> {
  /**
   * Validate if a value is a boolean
   * @param value Boolean
   */
  protected validate(value: boolean) {
    return value === true || value === false;
  }
}
