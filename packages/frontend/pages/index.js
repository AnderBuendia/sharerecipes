import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from '../components/layouts/Layout';
import RecipesContainer from '../components/recipes/RecipesContainer';

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
        <div className="container mx-auto w-9/12 sm:w-11/12"> 
          <div className="flex justify-between items-center">
            <p className="font-bold text-lg">New Recipes</p>
            <Link href="/popular">
              <a className="ml-auto w-30 bg-purple-500 px-2 rounded-full shadow-lg cursor-pointer hover:bg-purple-600 
                transition duration-200 ease-in-out transform hover:scale-105 text-center text-gray-200 uppercase font-roboto text-xs hover:font-bold">
                Popular Recipes
              </a>
            </Link>
          </div>
            
          <RecipesContainer recipes={getRecipes} />
        </div>
        </>
      )}
    </Layout>
  )
}

export default Index;