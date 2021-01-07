import React from 'react';
import Recipe from './Recipe';


const RecipesContainer = ({recipes}) => {
    return (  
        <div className="p-4 bg-white rounded-md shadow-md">
            <div 
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 cursor-pointer"
            >
              {recipes.map(recipe => (
                <Recipe
                  key={recipe.id}
                  recipe={recipe}
                />
              ))}
            </div>
        </div>
    );
}
 
export default RecipesContainer;