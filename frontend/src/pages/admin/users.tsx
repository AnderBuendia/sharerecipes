import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { decode } from 'jsonwebtoken';
import withCSRRedirect from '@Lib/hoc/with-csr-redirect.hoc';
import withCSRRoles from '@Lib/hoc/with-csr-roles.hoc';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import {
  isRequestSSR,
  loadAuthProps,
  serverRedirect,
} from '@Lib/utils/ssr.utils';
import { useUser } from '@Services/userAdapter';
import UsersPanel from '@Components/Admin/UsersPanel';
import MainLayout from '@Components/Layouts/MainLayout';
import Spinner from '@Components/generic/Spinner';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import { HTTPStatusCodes } from '@Enums/config/http-status-codes.enum';
import { UserRoles } from '@Enums/user/user-roles.enum';
import type { GSSProps } from '@Interfaces/props/gss-props.interface';
import type { IRedirect } from '@Interfaces/redirect.interface';

const AdminUsers: NextPage = () => {
  const router = useRouter();
  const { page: queryPage } = router.query as Record<string, string>;
  const numberPage = queryPage ? parseInt(queryPage.toString()) : 0;
  const [page, setPage] = useState(numberPage);
  const [userQuery, setUserQuery] = useState('');
  const { findUsers } = useUser();

  const { data, loading } = findUsers({ offset: page * 9, limit: 9 });

  const handleUserQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setUserQuery(e.target.value);
  };

  const handlePage = (e: number) => {
    setPage(e);
  };

  const handleRouterPage = (e: number) => {
    router.push(router.route + '/?page=' + e, undefined, {
      shallow: true,
    });
  };

  if (loading) return <Spinner />;

  const findUsersData = data ? data.find_users : null;
  const users = findUsersData.users;
  const totalUsers = findUsersData.total;

  return (
    <MainLayout
      title="Admin Panel"
      description="Users management"
      url={MainPaths.ADMIN}
    >
      <UsersPanel
        userQuery={userQuery}
        handleUserQuery={handleUserQuery}
        handlePage={handlePage}
        handleRouterPage={handleRouterPage}
        page={page}
        users={users}
        totalUsers={totalUsers}
      />
    </MainLayout>
  );
};

const redirect: IRedirect = {
  href: MainPaths.INDEX,
  statusCode: HTTPStatusCodes.FOUND,
  condition: RedirectConditions.REDIRECT_WHEN_USER_NOT_EXISTS,
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
      else props.authProps = authProps;
    } else if (!decode(jwt)) props.lostAuth = true;
  }

  props.componentProps = {
    shouldRender: !!props.authProps,
  };

  return { props };
};

export default withCSRRoles(withCSRRedirect(AdminUsers, redirect), [
  UserRoles.ADMIN,
]);
