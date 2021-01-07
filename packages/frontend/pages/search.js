import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import Spinner from '../components/generic/Spinner';
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

const Search = () => {

    const router = useRouter();
    const { query: { q } } = router;

    const { data, loading, error } = useQuery(GET_RECIPES);
    
    if (loading) return <Spinner />;

    const { getRecipes } = data;
    const [result, setResult] = useState([]);

    useEffect(() => {
        const search = q.toLowerCase();
        const filter = getRecipes.filter(recipe => {
            return (
                recipe.name.toLowerCase().includes(search) ||
                recipe.description.toLowerCase().includes(search) ||
                recipe.style.toLowerCase().includes(search)
            )
        });

        setResult(filter);
    }, [q, getRecipes]);

    return ( 
        <Layout>
            { result.length === 0 ? (
                <p className="text-4xl font-body font-bold text-center items-center justify-center mb-4">No Recipes</p>
            ) : (
                <>
                <div className="container mx-auto w-9/12 sm:w-11/12"> 
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-bold text-lg">Results by {q}</p>
                    </div>
                        
                    <RecipesContainer recipes={result} />
                </div>
                </>
            )}
        </Layout>
    );
}
 
export default Search;