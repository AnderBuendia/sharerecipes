import { useState } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { decode } from 'jsonwebtoken';
import withCSRRedirect from '@Lib/hoc/with-csr-redirect.hoc';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import {
  isRequestSSR,
  loadAuthProps,
  serverRedirect,
} from '@Lib/utils/ssr.utils';
import useRecipes from '@Lib/hooks/recipe/useRecipes';

/* components */
import MainLayout from '@Components/Layouts/MainLayout';
import NewRecipeForm from '@Components/NewRecipeForm';
import DragDropImage from '@Components/generic/DragDropImage';

/* enum conditions */
import { MainPaths } from '@Enums/paths/main-paths';
import { RedirectConditions } from '@Enums/redirect-conditions';
import { AlertMessages } from '@Enums/config/messages';

const NewRecipe = () => {
  const [recipeImage, setRecipeImage] = useState(null);
  const { setNewRecipe } = useRecipes();
  const router = useRouter();

  const onSubmit = async (submitData) => {
    console.log('ON SUBMIT', submitData);
    const response = setNewRecipe({ submitData, recipeImage });

    console.log('RESPONSE NEW RECIPE', response);
    if (response) {
      setRecipeImage('');

      router.push(MainPaths.INDEX);

      Swal.fire('Correct', AlertMessages.RECIPE_CREATED, 'success');
    }
  };

  return (
    <MainLayout
      title="Create a recipe"
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
                rounded={null}
                onChange={(url) => setRecipeImage(url)}
              />
            </div>
            <NewRecipeForm onSubmit={onSubmit} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const redirect = {
  href: MainPaths.INDEX,
  statusCode: 302,
  condition: RedirectConditions.REDIRECT_WHEN_USER_NOT_EXISTS,
};

export const getServerSideProps = async (ctx) => {
  const props = { lostAuth: false };
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

export default withCSRRedirect(NewRecipe, redirect);
