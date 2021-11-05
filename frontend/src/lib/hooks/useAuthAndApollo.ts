import { useState, useEffect } from 'react';
import { NormalizedCacheObject } from '@apollo/client';
import { initializeApollo } from '../apollo/apollo-client';
import { AuthProps } from '@Interfaces/props/gss-props.interface';
import { AuthState } from '@Interfaces/domain/auth.interface';
/**
 * Hook to handle the auth state and its Apollo client,
 * as well as associated side effects.
 */
export const useAuthAndApollo = (
  authProps?: AuthProps,
  lostAuth?: boolean,
  apolloCache?: NormalizedCacheObject
) => {
  const [authState, setAuth] = useState<AuthState>({
    user: authProps?.user,
    jwt: authProps?.jwt,
  });

  const apolloClient = initializeApollo(authState?.jwt, lostAuth, apolloCache);

  /* Create new apollo client after logout */
  useEffect(() => {
    if (!authState) initializeApollo(undefined, true);
  }, [authState]);

  return { apolloClient, authState, setAuth };
};
