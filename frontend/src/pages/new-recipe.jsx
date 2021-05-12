import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { useToasts } from 'react-toast-notifications';
import { decode } from 'jsonwebtoken';
import withCSRRedirect from '../lib/hoc/with-csr-redirect.hoc';
import { createApolloClient } from '../lib/apollo/apollo-client';
import { getJwtFromCookie } from '../lib/utils/jwt-cookie.utils';
import {
  isRequestSSR,
  loadAuthProps,
  serverRedirect,
} from '../lib/utils/ssr.utils';
import { NEW_RECIPE } from '../lib/graphql/recipe/mutation';
import { GET_RECIPES } from '../lib/graphql/recipe/query';

/* enum conditions */
import { MainPaths } from '../enums/paths/main-paths';
import { RedirectConditions } from '../enums/redirect-conditions';
import { AlertMessages } from '../enums/config/messages';

/* components */
import MainLayout from '../components/layouts/MainLayout';
import NewRecipeForm from '../components/NewRecipeForm';
import DragDropImage from '../components/generic/DragDropImage';

const NewRecipe = () => {
  /* Routing */
  const router = useRouter();
  /* Set new recipe image */
  const [recipeImage, setRecipeImage] = useState(null);

  /* Set Toast Notification */
  const { addToast } = useToasts();

  /* Apollo mutation */
  const [newRecipe] = useMutation(NEW_RECIPE, {
    update(cache, { data: { newRecipe } }) {
      const { getRecipes } = cache.readQuery({ query: GET_RECIPES });

      cache.writeQuery({
        query: GET_RECIPES,
        data: {
          getRecipes: [...getRecipes, newRecipe],
        },
      });
    },
  });

  const onSubmit = async (data) => {
    const {
      name,
      prep_time,
      serves,
      ingredients,
      description,
      difficulty,
      style,
      other_style,
    } = data;

    try {
      await newRecipe({
        variables: {
          input: {
            name,
            prep_time: parseInt(prep_time),
            serves: parseInt(serves),
            ingredients,
            difficulty: difficulty.value,
            style: other_style ? other_style : style.value,
            image_url: recipeImage.image_url,
            image_name: recipeImage.filename,
            description,
          },
        },
      });

      /* Recipe Image State */
      setRecipeImage('');

      /* Redirect to Home Page*/
      router.push(MainPaths.INDEX);

      /* Show alerts */
      Swal.fire('Correct', AlertMessages.RECIPE_CREATED, 'success');
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
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
          <div className="w-full max-w-lg bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
            <h2 className="text-4xl font-roboto font-bold text-gray-800 text-center my-4">
              Create New Recipe
            </h2>
            <label className="block text-black font-body font-bold mb-4">
              Recipe Image
            </label>
            <div className="flex w-128 h-56 overflow-hidden mx-auto my-4 rounded-md">
              <DragDropImage
                url={`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/recipes`}
                current={recipeImage?.image_url}
                name="photo"
                rounded={null}
                ratio={1}
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
