import React, { useState, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../config/apollo';
import ResolutionState from '../context/resolution/resolutionState';
import { setAccessToken } from '../lib/accessToken';
import '../styles/index.css';


const MyApp = ({ Component, pageProps }) => {
  const [loading, setLoading] = useState(true);

  const apolloClient = useApollo(pageProps.initialApolloState);

  useEffect(() => {
    fetch("http://localhost:4000/refresh_token", {
      method: "POST",
      credentials: "include"
    }).then(async x => {
      const { accessToken } = await x.json();
      setAccessToken(accessToken);
      setLoading(false);
    });
  }, []);

  // TODO: Put a spinner loader
  if (loading) return <div>Loading...</div>;
  

  return (
    <ApolloProvider client={apolloClient}>
      <ResolutionState>
        <Component {...pageProps} />
      </ResolutionState>
    </ApolloProvider>
  )
}

export default MyApp;
