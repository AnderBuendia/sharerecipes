import { UserEntityDoc } from '../interfaces/documents/user-document.interface';

/**
 * Type to represent populated / unpopulated user
 */
export type UserOrId = UserEntityDoc | string;
