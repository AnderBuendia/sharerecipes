import React from 'react';
import ProfileLayout from '../../components/layouts/ProfileLayout';
import withCSRRedirect from '../../lib/hoc/with-csr-redirect.hoc';
import withCSRAllowPaths from '../../lib/hoc/with-csr-allow-paths.hoc';
import {
  isRequestSSR,
  loadAuthProps,
  serverRedirect,
} from '../../lib/utils/ssr.utils';
import { createApolloClient } from '../../lib/apollo/apollo-client';
import { getJwtFromCookie } from '../../lib/utils/jwt-cookie.utils';
import MainLayout from '../../components/layouts/MainLayout';

/* enum conditions */
import { ProfilePaths } from '../../enums/paths/profile-paths';
import { MainPaths } from '../../enums/paths/main-paths';
import { RedirectConditions } from '../../enums/redirect-conditions';

const ProfileSection = ({ path }) => (
  <MainLayout
    title="Other actions"
    description="Other actions in your profile"
    url={path}
  >
    <ProfileLayout path={path} />
  </MainLayout>
);

const allowedPaths = Object.values(ProfilePaths);

const redirect = {
  href: MainPaths.LOGIN,
  statusCode: 302,
  condition: RedirectConditions.REDIRECT_WHEN_USER_NOT_EXISTS,
};

export const getServerSideProps = async (ctx) => {
  const props = { lostAuth: false };
  const isSSR = isRequestSSR(ctx.req.url);

  const path = `/profile/${ctx.params?.section}`;
  const isAllowed = allowedPaths.includes(path);

  redirect.query = { returnTo: path };

  const jwt = getJwtFromCookie(ctx.req.headers.cookie);

  if (jwt) {
    if (isSSR) {
      if (!isAllowed) ctx.res.statusCode = 404;
      const apolloClient = createApolloClient();

      const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);

      props.apolloCache = apolloClient.cache.extract();

      if (authProps) props.authProps = authProps;
      else serverRedirect(ctx.res, redirect);
    } else if (!decodeURI(jwt)) props.lostAuth = true;
  } else if (isSSR) serverRedirect(ctx.res, redirect);

  props.componentProps = {
    shouldRender: !!props.authProps,
    path,
    isAllowed,
  };

  return {
    props,
  };
};

export default withCSRAllowPaths(withCSRRedirect(ProfileSection, redirect));
