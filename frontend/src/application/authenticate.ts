import { useState } from 'react';
import { useAuthentication } from '@Services/authAdapter';
import { useUserStorage } from '@Services/storageAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import type { FormValuesLoginForm } from '@Types/forms/login-form.type';
import { AlertMessages, MessageTypes } from '@Enums/config/messages.enum';

export function useAuthenticate() {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const { setAuth } = useUserStorage();
  const { loginRequest, logoutRequest } = useAuthentication();
  const { notify } = useNotifier();

  const signIn = async (data: FormValuesLoginForm) => {
    try {
      const response = await loginRequest(data);
      const responseToJson = await response.json();

      if (responseToJson.error) {
        throw new Error(responseToJson.error);
      } else {
        setAuth({ user: responseToJson.user, jwt: responseToJson.token });

        notify({
          message: AlertMessages.LOGIN,
          messageType: MessageTypes.SUCCESS,
        });

        return true;
      }
    } catch (error) {
      if (error instanceof Error) {
        notify({
          message: error.message.replace('GraphQL error: ', ''),
          messageType: MessageTypes.ERROR,
        });
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

      notify({ message: AlertMessages.LOGOUT, messageType: MessageTypes.INFO });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        notify({ message: error.message, messageType: MessageTypes.ERROR });
      }

      return false;
    }
  };

  return { openDropdown, setOpenDropdown, signIn, signOut };
}
