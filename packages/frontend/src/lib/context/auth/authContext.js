import { createContext } from 'react';

const AuthContext = createContext({
    authState: {
        user: null,
        jwt: null,
    },
    setAuth: () => {}
});

export default AuthContext;