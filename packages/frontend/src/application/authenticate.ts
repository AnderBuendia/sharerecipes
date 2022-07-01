import { useState } from 'react';
import { useAuthentication } from '@Services/authAdapter';
import { useUserStorage } from '@Services/storageAdapter';
import { useNotifier } from '@Services/notification.service';
import type { FormValuesLoginForm } from '@Types/forms/login-form.type';
import { AlertMessages } from '@Enums/config/messages.enum';

export function useAuthenticate() {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const { setAuth } = useUserStorage();
  const { loginRequest, logoutRequest } = useAuthentication();
  const { notifySuccess, notifyError } = useNotifier();

  const signIn = async (data: FormValuesLoginForm) => {
    try {
      const response = await loginRequest(data);
      const responseToJson = await response.json();

      if (responseToJson.error) {
        throw new Error(responseToJson.error);
      } else {
        setAuth({ user: responseToJson.user, jwt: responseToJson.token });

        notifySuccess({ message: AlertMessages.LOGIN });

        return true;
      }
    } catch (error) {
      if (error instanceof Error) {
        notifyError({ message: error.message.replace('GraphQL error: ', '') });
      }

      return false;
    }
  };

  const signOut = async () => {
    try {
      await logoutRequest();

      setAuth({
        user: undefined,
        jwt: undefined,
      });

      notifySuccess({ message: AlertMessages.LOGOUT });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        notifyError({ message: error.message });
      }

      return false;
    }
  };

  return { openDropdown, setOpenDropdown, signIn, signOut };
}
