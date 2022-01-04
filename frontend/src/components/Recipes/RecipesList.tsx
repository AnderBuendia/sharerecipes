import { FC } from 'react';
import RecipeCard from '@Components/Recipes/RecipeCard';
import { IRecipe } from '@Interfaces/domain/recipe.interface';
import { FetchMoreGetRecipesArgs } from '@Types/apollo/query/fetch-more.type';

export type RecipesListProps = {
  recipes: IRecipe[] | null;
  fetchMore: (variables: FetchMoreGetRecipesArgs) => void;
};

const RecipesList: FC<RecipesListProps> = ({ recipes, fetchMore }) => {
  const recipesRendered =
    recipes && recipes.length > 0 ? (
      recipes.map((recipe: IRecipe, index: number) => (
        <RecipeCard
          key={recipe._id}
          recipe={recipe}
          numberOfRecipes={recipes.length}
          index={index}
          fetchMore={fetchMore}
        />
      ))
    ) : (
      <h3 className="text-4xl font-body font-bold text-center mt-10">
        No recipes
      </h3>
    );

  return (
    <div className="xssm:w-11/12 w-full mx-auto container">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {recipesRendered}
      </div>
    </div>
  );
};

export default RecipesList;
