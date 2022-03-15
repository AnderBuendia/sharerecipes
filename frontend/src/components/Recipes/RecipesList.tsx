import type { FC } from 'react';
import RecipeCard from '@Components/Recipes/RecipeCard';
import type { IRecipe } from '@Interfaces/domain/recipe.interface';
import type { FetchMoreFindRecipesArgs } from '@Types/apollo/query/fetch-more.type';

export type RecipesListProps = {
  recipes: IRecipe[] | null;
  fetchMore: (variables: FetchMoreFindRecipesArgs) => void;
};

const RecipesList: FC<RecipesListProps> = ({ recipes, fetchMore }) => {
  const recipesRendered =
    recipes && recipes.length > 0 ? (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {recipes.map((recipe: IRecipe, index: number) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            numberOfRecipes={recipes.length}
            index={index}
            fetchMore={fetchMore}
          />
        ))}
      </div>
    ) : (
      <h3 className="text-4xl font-body font-bold text-center mt-10">
        No recipes
      </h3>
    );

  return (
    <div className="xssm:w-11/12 w-full mx-auto container">
      {recipesRendered}
    </div>
  );
};

export default RecipesList;
