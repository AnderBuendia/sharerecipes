import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { withApollo } from '../config/apollo';
import { ToastProvider } from 'react-toast-notifications';
import ResolutionState from '../context/resolution/resolutionState';
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
        <ResolutionState>
          <ImagesState>
            <Component {...pageProps} />
          </ImagesState>
        </ResolutionState>
      </ToastProvider>
    </ApolloProvider>
  )
}

export default withApollo(MyApp);
