/** Exception: Value object format */
export class VOFormatException extends Error {
  /**
   * Creates a new exception
   * @param value Value object value
   * @param propName Value object property name
   */
  constructor(value: any, propName?: string) {
    super(
      `${propName ? `${propName}: ` : ''}${JSON.stringify(
        value
      )} does not comply with the established format`
    );
  }
}
