import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
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
          <div className="flex justify-between items-center mb-1">
            <p className="font-bold text-lg">New Recipes</p>
            <Link href="/popular">
              <a className="ml-auto w-36 bg-purple-500 px-2 rounded-full shadow-lg cursor-pointer hover:bg-purple-600 
                transition duration-200 ease-in-out transform hover:scale-105 text-center text-gray-200 uppercase font-roboto text-sm hover:font-bold">
                Popular Recipes
              </a>
            </Link>
          </div>
            
          <div className="p-4 bg-white rounded-md shadow-md">
            <div 
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 cursor-pointer"
            >
              {getRecipes.map(recipe => (
                <Recipe
                  key={recipe.id}
                  recipe={recipe}
                />
              ))}
            </div>
          </div>
        </div>
        </>
      )}
    </Layout>
  )
}

export default Index;