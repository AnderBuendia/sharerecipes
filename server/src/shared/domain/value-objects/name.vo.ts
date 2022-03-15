import {
  usernameValidation,
  recipeNameValidation,
} from '@Shared/utils/formValidation.utils';
import { PrimitiveValueObject } from '@Shared/domain/value-objects/primitive-value-object';

/**
 * User name value object
 */
export class VOUserName extends PrimitiveValueObject<string> {
  /**
   * Validate if a string is a name
   * @param value Name
   */
  protected validate(value: string) {
    return usernameValidation(value);
  }
}

/**
 * Recipe name value object
 */
export class VORecipeName extends PrimitiveValueObject<string> {
  /**
   * Validate if a string is a name
   * @param value Name
   */
  protected validate(value: string) {
    return recipeNameValidation(value);
  }
}
