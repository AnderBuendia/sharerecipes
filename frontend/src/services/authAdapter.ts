import { AuthenticationService } from '@Interfaces/ports/authentication.interface';
import { RestEndPoints } from '@Enums/paths/rest-endpoints.enum';
import { FormValuesLoginForm } from '@Types/forms/login-form.type';

export function useAuthentication(): AuthenticationService {
  const loginRequest = async (data: FormValuesLoginForm) => {
    return await fetch(process.env.NEXT_PUBLIC_SITE_URL + RestEndPoints.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  const logoutRequest = async () => {
    return await fetch(RestEndPoints.LOGOUT, {
      method: 'POST',
    });
  };

  return { loginRequest, logoutRequest };
}
