import '@Styles/index.css';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'next-themes';
import { ToastContainer } from 'react-toastify';
import AuthStoreContext from '@Lib/context/auth-store.context';
import { useAuthAndApollo } from '@Lib/hooks/useAuthAndApollo';
import { AppProviderStore } from '@Lib/context/app-store.context';
import { isRoute } from '@Lib/utils/is-route.utils';
import { toastSettings } from '@Config/toast.settings';
import Header from '@Components/Header';
import Footer from '@Components/Footer';
import type { GSSProps } from '@Interfaces/props/gss-props.interface';
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
    <>
      <ThemeProvider defaultTheme="dark" attribute="class">
        <AuthStoreContext.Provider value={{ authState, setAuth }}>
          <ApolloProvider client={apolloClient}>
            <AppProviderStore>
              <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-500">
                {noElementsInRoutes && <Header />}

                <main className="flex-1 place-content-center">
                  <Component {...componentProps} />
                </main>
                {<Footer />}
              </div>
            </AppProviderStore>
          </ApolloProvider>
        </AuthStoreContext.Provider>
      </ThemeProvider>
      <ToastContainer {...toastSettings} />
    </>
  );
};

export default MyApp;
