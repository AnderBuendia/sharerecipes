import { createContext, useContext } from 'react';

const AuthStoreContext = createContext<any>({});

export const useAuthStore = () => useContext(AuthStoreContext);

export default AuthStoreContext;
