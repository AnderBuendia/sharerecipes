import { useContext } from 'react';
import { useToasts } from 'react-toast-notifications';
import AuthContext from '@Lib/context/auth/authContext';
import { AlertMessages } from '@Enums/config/messages';
import { RestEndPoints } from '@Enums/paths/rest-endpoints';
import { MainPaths } from '@Enums/paths/main-paths';

export const getLoginRequest = (router) => {
  const { setAuth } = useContext(AuthContext);

  /* Set Toast Notification */
  const { addToast } = useToasts();

  const loginRequest = async (data) => {
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

        // @ts-ignore
        setAuth({ user, jwt });

        addToast(AlertMessages.LOGIN, { appearance: 'success' });

        setTimeout(() => {
          router.push(MainPaths.INDEX);
        }, 3000);
      }
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  };

  return { loginRequest };
};
