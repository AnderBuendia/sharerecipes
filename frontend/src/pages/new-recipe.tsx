import { useState } from 'react';
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { decode } from 'jsonwebtoken';
import withCSRRedirect from '@Lib/hoc/with-csr-redirect.hoc';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import {
  isRequestSSR,
  loadAuthProps,
  serverRedirect,
} from '@Lib/utils/ssr.utils';
import MainLayout from '@Components/Layouts/MainLayout';
import NewRecipeForm from '@Components/Forms/NewRecipeForm';
import DragDropImage from '@Components/generic/DragDropImage';
import { GSSProps } from '@Interfaces/props/gss-props.interface';
import { IRedirect } from '@Interfaces/redirect.interface';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { RedirectConditions } from '@Enums/redirect-conditions';
import { RecipeImage } from '@Interfaces/domain/recipe.interface';

const NewRecipePage: NextPage = () => {
  const [recipeImage, setRecipeImage] = useState<RecipeImage>();

  const handleChangeImage = (imageUrl: string, imageName: string) => {
    setRecipeImage({ image_url: imageUrl, image_name: imageName });
  };

  return (
    <MainLayout
      title="New recipe"
      description="Create a new recipe"
      url={MainPaths.NEW_RECIPE}
    >
      <div className="w-11/12 xl:w-10/12 mx-auto">
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg bg-white dark:bg-gray-700 rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
            <h2 className="text-4xl font-roboto font-bold text-center my-4">
              Create New Recipe
            </h2>
            <label className="block font-body font-bold mb-4">
              Recipe Image
            </label>
            <div className="flex w-128 h-56 overflow-hidden mx-auto my-4 rounded-md">
              <DragDropImage
                url={`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/recipes`}
                current={recipeImage?.image_url}
                name="photo"
                rounded={false}
                handleChange={handleChangeImage}
              />
            </div>
            <NewRecipeForm
              recipeImage={recipeImage}
              setRecipeImage={setRecipeImage}
            />
          </div>
        </div>
      </div>
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

export default withCSRRedirect(NewRecipePage, redirect);
