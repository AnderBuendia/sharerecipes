import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ToastProvider } from 'react-toast-notifications';
import '../styles/index.css';

/* Contexts */
import ResolutionState from '../lib/context/resolution/resolutionState';
import ImagesState from '../lib/context/images/imagesState';
import AuthContext from '../lib/context/auth/authContext';
import { useAuthAndApollo } from '../lib/hooks/useAuthAndApollo';

const MyApp = ({ Component, pageProps }) => {
  const { authProps, lostAuth, componentProps, apolloCache } = pageProps;

  const { setAuth, authState, apolloClient } = useAuthAndApollo(
    authProps, 
    lostAuth,
    apolloCache,
  );
  
  return (
    <>
      <AuthContext.Provider value={{ setAuth, authState }}>
        <ApolloProvider client={apolloClient}>
          <ToastProvider
            autoDismiss
            autoDismissTimeout={2000}
            placement='top-center'
          >
            <ResolutionState>
              <ImagesState>
                <Component {...componentProps} />
              </ImagesState>
            </ResolutionState>
          </ToastProvider>
        </ApolloProvider>
      </AuthContext.Provider>
    </>
  )
}

export default MyApp;