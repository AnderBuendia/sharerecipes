import { VOFormatException } from '@Shared/domain/value-objects/vo-format.exception';

/**
 * Date value object abstract class
 */
export class VODate {
  /**
   * Class constructor
   * @param value Date
   */
  constructor(public readonly value: Date) {
    if (!this.validate(value)) throw new VOFormatException(value);
  }

  /**
   * Validate if date is valid
   * @param date Date
   */
  validate(date: Date): boolean {
    return !isNaN(date.getTime());
  }

  /**
   * Check equality between date value objects
   * @param date Date
   */
  equals(date: VODate): boolean {
    return date.value.getTime() === this.value.getTime();
  }
}
