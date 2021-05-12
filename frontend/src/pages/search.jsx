import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '../lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '../lib/utils/ssr.utils';
import { createApolloClient } from '../lib/apollo/apollo-client';
import { GET_RECIPES } from '../lib/graphql/recipe/query';
import Spinner from '../components/generic/Spinner';
import MainLayout from '../components/layouts/MainLayout';
import RecipeCard from '../components/recipes/RecipeCard';
import RecipesList from '../components/recipes/RecipesList';
import { MainPaths } from '../enums/paths/main-paths';

const Search = () => {
    const router = useRouter();
    const { query: { q } } = router;
    const search = q.toLowerCase();

    const { data, loading } = useQuery(GET_RECIPES);

    if (loading) return <Spinner />;
    
    const recipes = data ? data.getRecipes : null;
 
    /* Filter recipes to search */
    const filterRecipes = recipes.filter(recipe => {
        return (
            recipe.name.toLowerCase().includes(search) ||
            recipe.description.toLowerCase().includes(search) ||
            recipe.style.toLowerCase().includes(search)
        )
    });

    const recipesRendered = filterRecipes ? (
        filterRecipes.map((recipe, index) => (
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
          title="Search"
          description="Search in ShareYourRecipes"
          url={MainPaths.SEARCH}
        >
          <RecipesList title={`Results by ${q}`}>
            {recipesRendered}
          </RecipesList>
        </MainLayout>
    );
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
 
export default Search;