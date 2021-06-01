import { createContext } from 'react';

const AuthContext = createContext({
  authState: null,
  setAuth: null,
});

export default AuthContext;
