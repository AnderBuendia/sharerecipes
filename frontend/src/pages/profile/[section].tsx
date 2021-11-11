import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
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
import { GSSProps } from '@Interfaces/props/gss-props.interface';
import { IRedirect } from '@Interfaces/redirect.interface';
import { ProfilePaths } from '@Enums/paths/profile-paths.enum';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { RedirectConditions } from '@Enums/redirect-conditions';

export type ProfileSectionPageProps = {
  path: ProfilePaths;
};

const ProfileSectionPage: NextPage<ProfileSectionPageProps> = ({ path }) => (
  <ProfileLayout path={path} />
);

const allowedPaths: string[] = Object.values(ProfilePaths);

const redirect: IRedirect = {
  href: MainPaths.LOGIN,
  statusCode: 302,
  condition: RedirectConditions.REDIRECT_WHEN_USER_NOT_EXISTS,
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const props: GSSProps = { lostAuth: false };
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

export default withCSRAllowPaths(withCSRRedirect(ProfileSectionPage, redirect));
