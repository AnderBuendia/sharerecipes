import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Layout from '../components/layouts/Layout';
import Recipe from '../components/Recipe';

const GET_RECIPES = gql`
  query getRecipes {
    getRecipes {
        id
        name
        serves
        ingredients
        prep_time
        difficulty
        image_name
        image_url
        style
        description
        author
    }
  }
`;

const Index = () => {
  const { data, loading, error } = useQuery(GET_RECIPES);

  if (loading) return null;

  const { getRecipes } = data;

  return (
    <Layout>
      { getRecipes.length === 0 ? (
        <p className="text-4xl font-body font-bold text-center items-center justify-center mb-4">No Recipes</p>
      ) : (
        <>
          <h1 className="text-4xl font-body font-bold text-center items-center justify-center mb-4">New Recipes</h1>
          <div 
            className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-3/5 md:w-full justify-center items-center gap-4 mb-2 cursor-pointer"
          >
            {getRecipes.map(recipe => (
              <Recipe
                key={recipe.id}
                recipe={recipe}
              />
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}

export default Index;