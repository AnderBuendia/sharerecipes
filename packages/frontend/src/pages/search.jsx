import React from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import Spinner from '../components/generic/Spinner';
import MainLayout from '../components/layouts/MainLayout';
import RecipeCard from '../components/recipes/RecipeCard';
import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '../lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '../lib/utils/ssr.utils';
import { createApolloClient } from '../lib/apollo/apollo-client';

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
        <Spinner />
      );
   
    return ( 
        <MainLayout>
            { filterRecipes && filterRecipes.length === 0 ? (
                <p className="text-4xl font-body font-bold text-center items-center justify-center mb-4">
                  No Recipes
                </p>
            ) : (
                <div className="container mx-auto w-11/12"> 
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-lg">Results by {q}</p>
                    </div>
                        
                    <div className="p-4 bg-white rounded-md shadow-md">
                        <div 
                        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 cursor-pointer"
                        >
                            {recipesRendered}
                        </div>
                    </div>
                </div>
            )}
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