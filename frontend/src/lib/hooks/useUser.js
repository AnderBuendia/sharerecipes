import { useState, useCallback, useContext } from 'react';
import { useToasts } from 'react-toast-notifications';
import AuthContext from '@Lib/context/auth/authContext';
import { RestEndPoints } from '@Enums/paths/rest-endpoints';
import { AlertMessages } from '@Enums/config/messages';

export default function useUser() {
  const [open, setOpen] = useState(false);
  const { authState, setAuth } = useContext(AuthContext);
  const { addToast } = useToasts();

  const signOut = useCallback(async () => {
    setOpen(false);

    try {
      await fetch(RestEndPoints.LOGOUT, {
        method: 'POST',
      });

      setAuth({
        user: null,
        jwt: null,
      });

      addToast(AlertMessages.LOGOUT, { appearance: 'info' });
    } catch (error) {
      addToast(error, { appearance: 'error' });
    }
  }, [setAuth]);

  return {
    open,
    authState,
    setOpen,
    setAuth,
    signOut,
  };
}
