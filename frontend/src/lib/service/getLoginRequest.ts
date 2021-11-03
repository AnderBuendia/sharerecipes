import { NextRouter } from 'next/router';
import { useToasts } from 'react-toast-notifications';
import useUser from '@Lib/hooks/user/useUser';
import { AlertMessages } from '@Enums/config/messages.enum';
import { RestEndPoints } from '@Enums/paths/rest-endpoints.enum';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { FormValuesLoginForm } from '@Types/forms/login-form.type';

export const getLoginRequest = (router: NextRouter) => {
  const { setAuth } = useUser();
  const { addToast } = useToasts();

  const loginRequest = async (data: FormValuesLoginForm) => {
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

        setTimeout(() => {
          router.push(MainPaths.INDEX);
        }, 3000);
      }
    } catch (error) {
      if (error instanceof Error) {
        addToast(error.message.replace('GraphQL error: ', ''), {
          appearance: 'error',
        });
      }
    }
  };

  return { loginRequest };
};
