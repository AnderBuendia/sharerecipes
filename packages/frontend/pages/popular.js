import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Layout from '../components/layouts/Layout';
import RecipesContainer from '../components/recipes/RecipesContainer';
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
    }
  }
`;

const Popular = () => {
  const { data, loading, error } = useQuery(GET_BEST_RECIPES);

  if (loading) return <Spinner />;

  const { getBestRecipes } = data;

  return (
    <Layout>
      { getBestRecipes.length === 0 ? (
        <p className="text-4xl font-body font-bold text-center items-center justify-center mb-4">No Recipes</p>
      ) : (
        <>
        <div className="container mx-auto w-9/12 sm:w-11/12"> 
          <div className="flex justify-between items-center mb-1">
            <p className="font-bold text-lg">Popular Recipes</p>
          </div>
            
          <RecipesContainer recipes={getBestRecipes} />
        </div>
        </>
      )}
    </Layout>
  )
}

export default Popular;