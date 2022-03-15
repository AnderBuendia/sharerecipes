import { AuthenticationService } from '@Interfaces/ports/authentication.interface';
import { NextRestEndPoints } from '@Enums/paths/rest-endpoints.enum';
import { FormValuesLoginForm } from '@Types/forms/login-form.type';

export function useAuthentication(): AuthenticationService {
  const loginRequest = async (data: FormValuesLoginForm) => {
    return await fetch(
      process.env.NEXT_PUBLIC_SITE_URL + NextRestEndPoints.LOGIN,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
  };

  const logoutRequest = async () => {
    return await fetch(NextRestEndPoints.LOGOUT, {
      method: 'POST',
    });
  };

  return { loginRequest, logoutRequest };
}
