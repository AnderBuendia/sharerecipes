import '@Styles/index.css';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from 'react-toast-notifications';
import { useAuthAndApollo } from '@Lib/hooks/useAuthAndApollo';
import AuthStoreContext from '@Lib/context/auth-store.context';
import { AppProviderStore } from '@Lib/context/app-store.context';
import { isRoute } from '@Lib/utils/is-route.utils';
import Header from '@Components/Header';
import Footer from '@Components/Footer';
import { GSSProps } from '@Interfaces/props/gss-props.interface';

interface CustomAppProps extends AppProps {
  pageProps: GSSProps;
}

const MyApp: NextPage<CustomAppProps> = ({ Component, pageProps }) => {
  const { authProps, lostAuth, componentProps, apolloCache } = pageProps;
  const { pathname } = useRouter();
  const noElementsInRoutes = isRoute(pathname);

  const { authState, setAuth, apolloClient } = useAuthAndApollo(
    authProps,
    lostAuth,
    apolloCache
  );

  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <AuthStoreContext.Provider value={{ authState, setAuth }}>
        <ApolloProvider client={apolloClient}>
          <AppProviderStore>
            <ToastProvider
              autoDismiss
              autoDismissTimeout={2000}
              placement="top-center"
            >
              {noElementsInRoutes && <Header />}
              <main className="flex place-content-center bg-gray-100 dark:bg-gray-500">
                <Component {...componentProps} />
              </main>
              {noElementsInRoutes && <Footer />}
            </ToastProvider>
          </AppProviderStore>
        </ApolloProvider>
      </AuthStoreContext.Provider>
    </ThemeProvider>
  );
};

export default MyApp;
