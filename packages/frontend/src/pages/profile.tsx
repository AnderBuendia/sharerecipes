import type { NextPage, GetServerSideProps } from 'next';
import withCSRRedirect from '@Lib/hoc/with-csr-redirect.hoc';
import { withAuthGSSP } from '@Lib/hof/gssp.hof';
import ProfileLayout from '@Components/Layouts/ProfileLayout';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { ProfilePaths } from '@Enums/paths/profile-paths.enum';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import { HTTPStatusCodes } from '@Enums/config/http-status-codes.enum';
import type { IRedirect } from '@Interfaces/redirect.interface';

const ProfilePage: NextPage = () => <ProfileLayout path={ProfilePaths.MAIN} />;

const redirect: IRedirect = {
  href: MainPaths.LOGIN,
  statusCode: HTTPStatusCodes.FOUND,
  condition: RedirectConditions.REDIRECT_WHEN_USER_NOT_EXISTS,
  query: { returnTo: MainPaths.PROFILE },
};

export const getServerSideProps: GetServerSideProps = withAuthGSSP(redirect);

export default withCSRRedirect(ProfilePage, redirect);
