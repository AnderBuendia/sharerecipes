import type { GetServerSidePropsContext } from 'next';
import { decode } from 'jsonwebtoken';
import {
  isRequestSSR,
  loadAuthProps,
  serverRedirect,
} from '@Lib/utils/ssr.utils';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import type { IRedirect } from '@Interfaces/redirect.interface';
import type { GSSProps } from '@Interfaces/props/gss-props.interface';

export const withAuthGSSP =
  (redirect?: IRedirect) => async (ctx: GetServerSidePropsContext) => {
    const props: GSSProps = { lostAuth: false };
    const isSSR = isRequestSSR(ctx.req.url);
    const jwt = getJwtFromCookie(ctx.req.headers.cookie);

    if (jwt) {
      if (isSSR) {
        const apolloClient = createApolloClient();
        const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);

        props.apolloCache = apolloClient.cache.extract();

        if (
          redirect &&
          redirect.condition === RedirectConditions.REDIRECT_WHEN_USER_EXISTS &&
          authProps
        ) {
          serverRedirect(ctx.res, redirect);
        } else if (
          redirect &&
          redirect.condition === RedirectConditions.REDIRECT_WHEN_USER_EXISTS &&
          !authProps
        ) {
          serverRedirect(ctx.res, redirect);
        } else props.authProps = authProps;
      } else if (!decode(jwt)) props.lostAuth = true;
    }

    props.componentProps = {
      shouldRender: !jwt || props.lostAuth || !!props.authProps,
    };

    return { props: props || null };
  };
