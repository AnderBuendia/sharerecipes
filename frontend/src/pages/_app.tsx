import '@Styles/index.css';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from 'react-toast-notifications';
import { useAuthAndApollo } from '@Lib/hooks/useAuthAndApollo';
import AuthStoreContext from '@Lib/context/auth-store.context';
import { GSSProps } from '@Interfaces/props/gss-props.interface';

interface CustomAppProps extends AppProps {
  pageProps: GSSProps;
}

const MyApp: NextPage<CustomAppProps> = ({ Component, pageProps }) => {
  const { authProps, lostAuth, componentProps, apolloCache } = pageProps;

  const { authState, setAuth, apolloClient } = useAuthAndApollo(
    authProps,
    lostAuth,
    apolloCache
  );

  return (
    <ThemeProvider attribute="class">
      <AuthStoreContext.Provider value={{ authState, setAuth }}>
        <ApolloProvider client={apolloClient}>
          <ToastProvider
            autoDismiss
            autoDismissTimeout={2000}
            placement="top-center"
          >
            <Component {...componentProps} />
          </ToastProvider>
        </ApolloProvider>
      </AuthStoreContext.Provider>
    </ThemeProvider>
  );
};

export default MyApp;
