import { decode } from 'jsonwebtoken';
import { createApolloClient } from '../lib/apollo/apollo-client';
import withCSRRedirect from '../lib/hoc/with-csr-redirect.hoc';
import { getJwtFromCookie } from '../lib/utils/jwt-cookie.utils';
import {
  isRequestSSR,
  loadAuthProps,
  serverRedirect,
} from '../lib/utils/ssr.utils';
import SignUpForm from '@Components/forms/SignUpForm';
import { MainPaths } from '../enums/paths/main-paths';
import { RedirectConditions } from '../enums/redirect-conditions';

const SignUpPage = () => <SignUpForm />;

const redirect = {
  href: MainPaths.INDEX,
  statusCode: 302,
  condition: RedirectConditions.REDIRECT_WHEN_USER_EXISTS,
};

export const getServerSideProps = async (ctx) => {
  const props = { lostAuth: false };
  const isSSR = isRequestSSR(ctx.req.url);

  const jwt = getJwtFromCookie(ctx.req.headers.cookie);

  if (jwt) {
    if (isSSR) {
      const apolloClient = createApolloClient();
      const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);

      if (authProps) serverRedirect(ctx.res, redirect);
    } else if (!decode(jwt)) props.lostAuth = true;
  }

  props.componentProps = {
    shouldRender: !jwt || props.lostAuth,
  };

  return { props };
};

export default withCSRRedirect(SignUpPage, redirect);
