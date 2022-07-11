import type { NextPage, GetServerSideProps } from 'next';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import withCSRRedirect from '@Lib/hoc/with-csr-redirect.hoc';
import withCSRRoles from '@Lib/hoc/with-csr-roles.hoc';
import { withAuthGSSP } from '@Lib/hof/gssp.hof';
import { useUser } from '@Services/user.service';
import UsersPanel from '@Components/Admin/UsersPanel';
import MainLayout from '@Components/Layouts/MainLayout';
import Spinner from '@Components/generic/Spinner';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import { HTTPStatusCodes } from '@Enums/config/http-status-codes.enum';
import { UserRoles } from '@Enums/user/user-roles.enum';
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

export const getServerSideProps: GetServerSideProps = withAuthGSSP(redirect);

export default withCSRRoles(withCSRRedirect(AdminUsers, redirect), [
  UserRoles.ADMIN,
]);
