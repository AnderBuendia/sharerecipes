import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { withApollo } from '../config/apollo';
import { ToastProvider } from 'react-toast-notifications';
import AppState from '../context/app/appState';
import ImagesState from '../context/images/imagesState';
import '../styles/index.css';

const MyApp = ({ Component, pageProps, apolloClient }) => {

  return (
    <ApolloProvider client={apolloClient}>
      <ToastProvider
        autoDismiss
        autoDismissTimeout={2000}
        placement='top-center'
      >
        <AppState>
          <ImagesState>
            <Component {...pageProps} />
          </ImagesState>
        </AppState>
      </ToastProvider>
    </ApolloProvider>
  )
}

export default withApollo(MyApp);
