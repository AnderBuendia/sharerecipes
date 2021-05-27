import React from 'react';
import { useQuery } from '@apollo/client';
import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '../lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '../lib/utils/ssr.utils';
import { createApolloClient } from '../lib/apollo/apollo-client';
import { GET_BEST_RECIPES } from '../lib/graphql/recipe/query';
import MainLayout from '../components/layouts/MainLayout';
import RecipeCard from '../components/recipes/RecipeCard';
import RecipesList from '../components/recipes/RecipesList';
import Spinner from '../components/generic/Spinner';
import { MainPaths } from '../enums/paths/main-paths';

const Popular = () => {
  const { data, loading } = useQuery(GET_BEST_RECIPES, {
    variables: {
      offset: 0,
      limit: 20,
    },
  });

  if (loading) return <Spinner />;
  const recipes = data ? data.getBestRecipes : null;

  const recipesRendered = recipes ? (
    recipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)
  ) : (
    <h3 className="text-4xl font-body font-bold text-center mt-10">
      No recipes
    </h3>
  );

  return (
    <MainLayout
      title="Search"
      description="Search in ShareYourRecipes"
      url={MainPaths.POPULAR}
    >
      <div className="container mx-auto w-11/12">
        <h1 className="font-bold text-lg">Popular Recipes</h1>
        <RecipesList>{recipesRendered}</RecipesList>
      </div>
    </MainLayout>
  );
};

export const getServerSideProps = async (ctx) => {
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
