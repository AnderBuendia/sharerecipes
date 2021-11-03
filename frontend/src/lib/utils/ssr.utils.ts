import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ServerResponse } from 'http';
import { loadCurrentUserSSR } from '@Lib/utils/user.utils';
import { generateQueryParams } from '@Lib/utils/url.utils';
import { removeJwtCookie } from '@Lib/utils/jwt-cookie.utils';
import { IRedirect } from '@Interfaces/redirect.interface';

export const isRequestSSR = (currentUrl?: string) => {
  if (!currentUrl) return true;
  const extension = currentUrl.split('?').shift()?.split('.').pop();
  return !extension || extension !== 'json';
};

export const serverRedirect = (res: ServerResponse, redirect: IRedirect) => {
  const { href, statusCode, query } = redirect;

  let queryString;

  if (query) queryString = generateQueryParams(query);
  const url = queryString ? `${href}?${queryString}` : href;

  res.setHeader('Location', url);
  res.statusCode = statusCode;
  res.end;
};

export const loadAuthProps = async (
  res: ServerResponse,
  jwt: string,
  apolloClient: ApolloClient<NormalizedCacheObject>
) => {
  try {
    return await loadCurrentUserSSR(jwt, apolloClient);
  } catch (error) {
    removeJwtCookie(res);
  }
};
