import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { decode } from 'jsonwebtoken';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import withCSRRedirect from '@Lib/hoc/with-csr-redirect.hoc';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import {
  isRequestSSR,
  loadAuthProps,
  serverRedirect,
} from '@Lib/utils/ssr.utils';
import SignUpForm from '@Components/Forms/SignUpForm';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { HTTPStatusCodes } from '@Enums/config/http-status-codes.enum';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import type { GSSProps } from '@Interfaces/props/gss-props.interface';
import type { IRedirect } from '@Interfaces/redirect.interface';

const SignUpPage: NextPage = () => <SignUpForm />;

const redirect: IRedirect = {
  href: MainPaths.INDEX,
  statusCode: HTTPStatusCodes.FOUND,
  condition: RedirectConditions.REDIRECT_WHEN_USER_EXISTS,
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const props: GSSProps = { lostAuth: false };
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
