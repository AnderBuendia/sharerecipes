// @ts-nocheck
import '../styles/index.css';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from 'react-toast-notifications';
import { useAuthAndApollo } from '../lib/hooks/useAuthAndApollo';
import AuthContext from '../lib/context/auth/authContext';

const MyApp = ({ Component, pageProps }) => {
  const { authProps, lostAuth, componentProps, apolloCache } = pageProps;

  const { setAuth, authState, apolloClient } = useAuthAndApollo(
    authProps,
    lostAuth,
    apolloCache
  );

  return (
    <ThemeProvider attribute="class">
      <AuthContext.Provider value={{ setAuth, authState }}>
        <ApolloProvider client={apolloClient}>
          <ToastProvider
            autoDismiss
            autoDismissTimeout={2000}
            placement="top-center"
          >
            <Component {...componentProps} />
          </ToastProvider>
        </ApolloProvider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default MyApp;
