import { createAdaptedAuthState } from '@Services/adapters/authState.adapter';
import { NextRestEndPoints } from '@Enums/paths/rest-endpoints.enum';
import type { UserLoginDTO } from '@Application/dto/user.dto';
import type { AuthenticationService } from '@Interfaces/ports/service/authentication-service.interface';

export function useAuthentication(): AuthenticationService {
  const loginRequest = async (data: UserLoginDTO) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SITE_URL + NextRestEndPoints.LOGIN,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      const responseToJson = await response.json();

      if (responseToJson.error) throw new Error(responseToJson.error);

      return createAdaptedAuthState(responseToJson);
    } catch (error: any) {
      throw error;
    }
  };

  const logoutRequest = async () => {
    return await fetch(NextRestEndPoints.LOGOUT, {
      method: 'POST',
    });
  };

  return { loginRequest, logoutRequest };
}
