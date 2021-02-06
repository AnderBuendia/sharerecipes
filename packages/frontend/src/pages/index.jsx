import React from 'react';
import { useQuery } from '@apollo/client';
import Spinner from '../components/generic/Spinner';
import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '../lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '../lib/utils/ssr.utils';
import { createApolloClient } from '../lib/apollo/apollo-client';
import { GET_RECIPES } from '../lib/graphql/recipe/query';
import { MainPaths } from '../enums/paths/main-paths';
import MainLayout from '../components/layouts/MainLayout';
import RecipesList from '../components/recipes/RecipesList';
import RecipeCard from '../components/recipes/RecipeCard';

const Index = () => {
  const { data, loading } = useQuery(GET_RECIPES);

  if (loading) return <Spinner />;
  const recipes = data ? data.getRecipes : null;

  const recipesRendered = recipes ? (
    recipes.map((recipe, index) => (
      <RecipeCard
        key={index}
        recipe={recipe}
      />
    ))
  ) : (
    <h3 className="text-4xl font-body font-bold text-center mt-10">No recipes</h3>
  );
 
  return (
    <MainLayout
      title="Home"
      description="Share your own recipes"
      url={MainPaths.INDEX}
    >
      <RecipesList title="New Recipes">
        {recipesRendered}
      </RecipesList>
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