import { useState, useEffect } from 'react';
import { initializeApollo } from '../apollo/apollo-client';

/**
 * Hook to handle the auth state and its Apollo client, 
 * as well as associated side effects.
 */
export const useAuthAndApollo = (authProps, lostAuth, apolloCache) => {
  const [authState, setAuth] = useState({
    user: authProps ? authProps.user : null,
    jwt: authProps ? authProps.jwt : null,
  });

  const apolloClient = initializeApollo(authState.jwt, lostAuth, apolloCache);

  /* Create new apollo client after logout */
  useEffect(() => {
    if (!authState) initializeApollo(null, true);
  }, [authState]);
  
  return { apolloClient, setAuth, authState };
};