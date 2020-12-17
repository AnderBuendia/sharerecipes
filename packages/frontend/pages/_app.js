import React, { useState, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../config/apollo';
import { withApollo } from '../config/apollo';
import ResolutionState from '../context/resolution/resolutionState';
import { setAccessToken } from '../lib/accessToken';
import '../styles/index.css';


const MyApp = ({ Component, pageProps, apolloClient }) => {

  return (
    <ApolloProvider client={apolloClient}>
      <ResolutionState>
        <Component {...pageProps} />
      </ResolutionState>
    </ApolloProvider>
  )
}

export default withApollo(MyApp);
