import { createContext, Dispatch, SetStateAction } from 'react';
import { AuthState } from '@Interfaces/context/auth-context.interface';

export type AuthContextType = {
  authState: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
};

const AuthContext = createContext<AuthContextType>({
  authState: {
    user: undefined,
    jwt: undefined,
  },
  setAuth: () => {},
});

export default AuthContext;
