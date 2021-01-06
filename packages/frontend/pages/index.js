import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Layout from '../components/layouts/Layout';
import Recipe from '../components/recipe/Recipe';

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
    }
  }
`;

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

const Index = () => {
  const { data: dataRecipe, loading: loadingRecipe, error } = useQuery(GET_RECIPES);
  const { data: dataBest, loading: loadingBest } = useQuery(GET_BEST_RECIPES);

  if (loadingRecipe || loadingBest) return null;

  const { getRecipes } = dataRecipe;
  const { getBestRecipes } = dataBest;

  return (
    <Layout>
      { getRecipes.length === 0 ? (
        <p className="text-4xl font-body font-bold text-center items-center justify-center mb-4">No Recipes</p>
      ) : (
        <>
        <div className="mb-5">
          <h1 className="text-4xl font-body font-bold text-center items-center justify-center mb-4">Best Recipes</h1>
          <div 
            className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-3/5 md:w-full justify-center items-center gap-5 cursor-pointer"
          >
            {getBestRecipes.map(recipe => (
              <Recipe
                key={recipe.id}
                recipe={recipe}
              />
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-body font-bold text-center items-center justify-center mb-4">New Recipes</h1>
          <div 
            className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-3/5 md:w-full justify-center items-center gap-5 cursor-pointer"
          >
            {getRecipes.map(recipe => (
              <Recipe
                key={recipe.id}
                recipe={recipe}
              />
            ))}
          </div>
        </div>
        </>
      )}
    </Layout>
  )
}

export default Index;