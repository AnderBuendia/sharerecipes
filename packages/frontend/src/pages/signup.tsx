import type { NextPage, GetServerSideProps } from 'next';
import withCSRRedirect from '@Lib/hoc/with-csr-redirect.hoc';
import { withAuthGSSP } from '@Lib/hof/gssp.hof';
import SignUpForm from '@Components/Forms/SignUpForm';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { HTTPStatusCodes } from '@Enums/config/http-status-codes.enum';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import type { IRedirect } from '@Interfaces/redirect.interface';

const SignUpPage: NextPage = () => <SignUpForm />;

const redirect: IRedirect = {
  href: MainPaths.INDEX,
  statusCode: HTTPStatusCodes.FOUND,
  condition: RedirectConditions.REDIRECT_WHEN_USER_EXISTS,
};

export const getServerSideProps: GetServerSideProps = withAuthGSSP(redirect);

export default withCSRRedirect(SignUpPage, redirect);
