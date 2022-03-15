import { UserEntityDoc } from '@Shared/infrastructure/http/mongodb/interfaces/documents/user-document.interface';

export type PublicUserDTO = UserEntityDoc;

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}

export interface CreateUserDTO extends AuthenticateUserDTO {
  name: string;
}

export interface UpdateUserDTO {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

export interface SendMailUserDTO {
  url: string;
  text: string;
}

export interface ConfirmUserDTO {
  token: string;
  confirmed?: boolean;
}

export interface DeleteUserDTO {
  email: string;
}

export interface ForgotUserPasswordDTO extends DeleteUserDTO {}

export interface ResetUserPasswordDTO {
  token: string;
  password: string;
}
