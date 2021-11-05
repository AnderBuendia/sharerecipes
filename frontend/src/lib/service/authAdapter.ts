import { useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useUserStorage } from '@Lib/service/storageAdapter';
import { AlertMessages } from '@Enums/config/messages.enum';
import { RestEndPoints } from '@Enums/paths/rest-endpoints.enum';
import { FormValuesLoginForm } from '@Types/forms/login-form.type';

export function useAuthentication() {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const { addToast } = useToasts();
  const { setAuth } = useUserStorage();

  const signIn = async (data: FormValuesLoginForm) => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_SITE_URL + RestEndPoints.LOGIN,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      const resJson = await res.json();

      if (resJson.error) {
        addToast(resJson.error, { appearance: 'error' });
      } else {
        const jwt = resJson.token;
        const user = resJson.user;

        setAuth({ user, jwt });

        addToast(AlertMessages.LOGIN, { appearance: 'success' });

        return true;
      }
    } catch (error) {
      if (error instanceof Error) {
        addToast(error.message.replace('GraphQL error: ', ''), {
          appearance: 'error',
        });
      }
    }
  };

  const signOut = async () => {
    setOpenDropdown(false);

    try {
      await fetch(RestEndPoints.LOGOUT, {
        method: 'POST',
      });

      setAuth({
        user: undefined,
        jwt: undefined,
      });

      addToast(AlertMessages.LOGOUT, { appearance: 'info' });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        addToast(error, { appearance: 'error' });
      }

      return false;
    }
  };

  return { signIn, signOut, openDropdown, setOpenDropdown };
}
