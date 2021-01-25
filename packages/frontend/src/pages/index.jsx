import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '../lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '../lib/utils/ssr.utils';
import { createApolloClient } from '../lib/apollo/apollo-client';
import { MainPaths } from '../enums/paths/main-paths';
import MainLayout from '../components/layouts/MainLayout';
import RecipeCard from '../components/recipes/RecipeCard';
import Spinner from '../components/generic/Spinner';

const GET_RECIPES = gql`
  query getRecipes {
    getRecipes {
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

const Index = () => {
  const { data } = useQuery(GET_RECIPES);
  
  const recipes = data ? data.getRecipes : null;

  const recipesRendered = recipes ? (
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
            <p className="font-bold text-lg">New Recipes</p>
            <Link href={MainPaths.POPULAR}>
              <a className="ml-auto w-30 bg-purple-500 px-2 rounded-full shadow-lg cursor-pointer hover:bg-purple-600 
                transition duration-200 ease-in-out transform hover:scale-105 text-center text-gray-200 uppercase font-roboto text-xs hover:font-bold">
                Popular Recipes
              </a>
            </Link>
          </div>
            
          <div className="p-4 bg-white rounded-md shadow-md">
            <div 
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 cursor-pointer"
            >
              {recipesRendered}
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

export default Index;