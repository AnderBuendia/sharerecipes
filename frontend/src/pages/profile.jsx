import { decode } from 'jsonwebtoken';
import withCSRRedirect from '@Lib/hoc/with-csr-redirect.hoc';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import {
  isRequestSSR,
  loadAuthProps,
  serverRedirect,
} from '@Lib/utils/ssr.utils';

/* components */
import MainLayout from '@Components/Layouts/MainLayout';
import ProfileLayout from '@Components/Layouts/ProfileLayout';

/* enum conditions */
import { MainPaths } from '@Enums/paths/main-paths';
import { ProfilePaths } from '@Enums/paths/profile-paths';
import { RedirectConditions } from '@Enums/redirect-conditions';

const Profile = () => (
  <MainLayout
    title="Your Profile"
    description="This is your ShareYourRecipes profile"
    url={MainPaths.PROFILE}
  >
    <ProfileLayout path={ProfilePaths.MAIN} />
  </MainLayout>
);

const redirect = {
  href: MainPaths.LOGIN,
  statusCode: 302,
  condition: RedirectConditions.REDIRECT_WHEN_USER_NOT_EXISTS,
  query: { returnTo: MainPaths.PROFILE },
};

export const getServerSideProps = async (ctx) => {
  const props = { lostAuth: false };
  const isSSR = isRequestSSR(ctx.req.url);

  const jwt = getJwtFromCookie(ctx.req.headers.cookie);

  if (jwt) {
    if (isSSR) {
      const apolloClient = createApolloClient();
      const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);

      props.apolloCache = apolloClient.cache.extract();

      if (!authProps) serverRedirect(ctx.res, redirect);
      else props.authProps = authProps;
    } else if (!decode(jwt)) props.lostAuth = true;
  }

  props.componentProps = {
    shouldRender: !!props.authProps,
  };

  return { props };
};

export default withCSRRedirect(Profile, redirect);
