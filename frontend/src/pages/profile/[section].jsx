import withCSRRedirect from '@Lib/hoc/with-csr-redirect.hoc';
import withCSRAllowPaths from '@Lib/hoc/with-csr-allow-paths.hoc';
import {
  isRequestSSR,
  loadAuthProps,
  serverRedirect,
} from '@Lib/utils/ssr.utils';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import ProfileLayout from '@Components/Layouts/ProfileLayout';
import MainLayout from '@Components/Layouts/MainLayout';
import { ProfilePaths } from '@Enums/paths/profile-paths';
import { MainPaths } from '@Enums/paths/main-paths';
import { RedirectConditions } from '@Enums/redirect-conditions';

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

  const path = `${MainPaths.PROFILE}/${ctx.params?.section}`;
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
