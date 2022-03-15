import { PrimitiveValueObject } from './primitive-value-object';

/**
 * Positive number value object
 */
export class VOPositiveNumber extends PrimitiveValueObject<number> {
  /**
   * Validate the number
   * @param value Number
   */
  protected validate(value: number): boolean {
    return !isNaN(value) && value >= 0;
  }
}
