import { validate as uuidValidate } from 'uuid';
import { PrimitiveValueObject } from '@Shared/domain/value-objects/primitive-value-object';

/**
 * Uuid value object
 */
export class VOUuid extends PrimitiveValueObject<string> {
  /**
   * Creates a new UUID value object
   * @param value Uuid
   */
  protected validate(value: string) {
    return uuidValidate(value);
  }
}
