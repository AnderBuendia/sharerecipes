import type { NextPage, GetServerSideProps } from 'next';
import withCSRRedirect from '@Lib/hoc/with-csr-redirect.hoc';
import { withAuthGSSP } from '@Lib/hof/gssp.hof';
import MainLayout from '@Components/Layouts/MainLayout';
import NewRecipeForm from '@Components/Forms/NewRecipeForm';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { HTTPStatusCodes } from '@Enums/config/http-status-codes.enum';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import type { IRedirect } from '@Interfaces/redirect.interface';

const NewRecipePage: NextPage = () => {
  return (
    <MainLayout
      title="New Recipe"
      description="Create a new recipe"
      url={MainPaths.NEW_RECIPE}
    >
      <NewRecipeForm />
    </MainLayout>
  );
};

const redirect: IRedirect = {
  href: MainPaths.INDEX,
  statusCode: HTTPStatusCodes.FOUND,
  condition: RedirectConditions.REDIRECT_WHEN_USER_NOT_EXISTS,
};

export const getServerSideProps: GetServerSideProps = withAuthGSSP(redirect);

export default withCSRRedirect(NewRecipePage, redirect);
