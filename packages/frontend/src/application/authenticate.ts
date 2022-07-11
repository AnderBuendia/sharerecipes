import { useState } from 'react';
import { useAuthentication } from '@Services/auth.service';
import { useUserStorage } from '@Services/storage.service';
import { useNotifier } from '@Services/notification.service';
import { AlertMessages } from '@Enums/config/messages.enum';
import type { UserLoginDTO } from '@Application/dto/user.dto';

export function useAuthenticate() {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const { setAuth } = useUserStorage();
  const { loginRequest, logoutRequest } = useAuthentication();
  const { notifySuccess, notifyError } = useNotifier();

  const signIn = async (data: UserLoginDTO) => {
    try {
      const authState = await loginRequest(data);

      setAuth(authState);

      notifySuccess({ message: AlertMessages.LOGIN });

      return true;
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
