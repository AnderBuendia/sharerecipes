import '@Styles/index.css';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from 'react-toast-notifications';
import { useAuthAndApollo } from '@Lib/hooks/useAuthAndApollo';
import AuthStoreContext from '@Lib/context/auth-store.context';
import { GSSProps } from '@Interfaces/props/gss-props.interface';
import { MainPaths } from '@Enums/paths/main-paths.enum';

const HeaderDynamic = dynamic(import('@Components/Header'), { ssr: false });

interface CustomAppProps extends AppProps {
  pageProps: GSSProps;
}

const MyApp: NextPage<CustomAppProps> = ({ Component, pageProps }) => {
  const { authProps, lostAuth, componentProps, apolloCache } = pageProps;
  const { pathname } = useRouter();

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
            <div className="min-h-screen bg-gray-200 dark:bg-gray-500">
              {pathname !== MainPaths.LOGIN &&
                pathname !== MainPaths.SIGNUP && <HeaderDynamic />}
              <Component {...componentProps} />
            </div>
          </ToastProvider>
        </ApolloProvider>
      </AuthStoreContext.Provider>
    </ThemeProvider>
  );
};

export default MyApp;
