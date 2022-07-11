import type { Dispatch, SetStateAction } from 'react';
import { createContext, useContext } from 'react';
import type { AuthState } from '@Interfaces/domain/auth.interface';
interface IAuthContext {
  authState: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
}
const AuthStoreContext = createContext<IAuthContext>({} as any);

export const useAuthStore = () => {
  const context = useContext(AuthStoreContext);

  if (context === undefined || !Object.keys(context).length) {
    throw new Error('useAuthStore must be used within AuthStoreProvider');
  }

  return context;
};

export default AuthStoreContext;
