import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '../lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '../lib/utils/ssr.utils';
import { createApolloClient } from '../lib/apollo/apollo-client';
import MainLayout from '../components/layouts/MainLayout';
import RecipeCard from '../components/recipes/RecipeCard';
import Spinner from '../components/generic/Spinner';

const GET_BEST_RECIPES = gql`
  query getBestRecipes {
    getBestRecipes {
        id
        name
        serves
        ingredients
        prep_time
        difficulty
        image_url
        style
        description
        average_vote
        url
    }
  }
`;

const Popular = () => {
  const { data } = useQuery(GET_BEST_RECIPES);

  const recipes = data ? data.getBestRecipes : null;

  const bestRecipesRendered = recipes ? (
    recipes.map((recipe, index) => (
      <RecipeCard
        key={index}
        recipe={recipe}
      />
    ))
  ) : (
    <Spinner />
  );

  return (
    <MainLayout>
      { recipes && recipes.length === 0 ? (
        <p className="text-4xl font-body font-bold text-center items-center justify-center mb-4">
          No Recipes
        </p>
      ) : (
        <div className="container mx-auto w-11/12"> 
          <div className="flex justify-between items-center">
            <p className="font-bold text-lg">Popular Recipes</p>
          </div>
            
          <div className="p-4 bg-white rounded-md shadow-md">
            <div 
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 cursor-pointer"
            >
              {bestRecipesRendered}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export const getServerSideProps = async ctx => {
  const props = { lostAuth: false };
  const isSSR = isRequestSSR(ctx.req.url);

  const jwt = getJwtFromCookie(ctx.req.headers.cookie);

  if (jwt) {
    if (isSSR) {
      const apolloClient = createApolloClient();
      const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);
      
      if (authProps) props.authProps = authProps;
    } else if (!decode(jwt)) props.lostAuth = true;
  }

  return { props: props || null };
};

export default Popular;