import { FormValuesLoginForm } from '@Types/forms/login-form.type';

export interface AuthenticationService {
  loginRequest: (data: FormValuesLoginForm) => Promise<Response>;
  logoutRequest: () => Promise<Response>;
}
