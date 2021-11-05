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
import useUser from '@Lib/hooks/user/useUser';
import UsersPanel from '@Components/Admin/UsersPanel';
import MainLayout from '@Components/Layouts/MainLayout';
import Spinner from '@Components/generic/Spinner';
import { GSSProps } from '@Interfaces/props/gss-props.interface';
import { IRedirect } from '@Interfaces/redirect.interface';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { RedirectConditions } from '@Enums/redirect-conditions';
import { UserRoles } from '@Enums/user/user-roles.enum';
import { UserProfile } from '@Interfaces/domain/user.interface';

const AdminUsers: NextPage = () => {
  const router = useRouter();
  const { page: queryPage } = router.query as Record<string, string>;

  const numberPage = queryPage ? parseInt(queryPage.toString()) : 0;
  const [page, setPage] = useState(numberPage);
  const [q, setQ] = useState('');

  const { getUsers } = useUser();
  const { data, loading } = getUsers({ offset: page * 9, limit: 9 });

  const searchUser = (users: UserProfile[]) => {
    const columns = users[0] && Object.keys(users[0]);

    return users.filter((row) =>
      columns.some(
        (column) =>
          row[column as keyof UserProfile].toString().toLowerCase().indexOf(q) >
          -1
      )
    );
  };

  const handleQ = (e: ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
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

  const totalPages = data ? Math.ceil(data.getUsers.total / 9) : null;
  let users = data ? searchUser(data.getUsers.users) : null;

  return (
    <MainLayout
      title="Admin Panel"
      description="Users management"
      url={MainPaths.ADMIN}
    >
      <UsersPanel
        q={q}
        handleQ={handleQ}
        handlePage={handlePage}
        handleRouterPage={handleRouterPage}
        totalUsers={data.getUsers.total}
        page={page}
        users={users}
        totalPages={totalPages}
      />
    </MainLayout>
  );
};

const redirect: IRedirect = {
  href: MainPaths.INDEX,
  statusCode: 302,
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
