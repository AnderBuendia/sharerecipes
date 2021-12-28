import { FC } from 'react';
import { SortRecipesEnum } from '@Enums/sort-recipes.enum';
import { useRecipeStorage } from '@Services/storageAdapter';

const RecipesNav: FC = () => {
  const { sortRecipes, setSortRecipes } = useRecipeStorage();

  return (
    <nav className="flex flex-row justify-center mb-4">
      <button
        className={`${
          sortRecipes === SortRecipesEnum.CREATED_AT
            ? 'bg-gray-800'
            : 'bg-gray-400'
        } px-4 py-1 mr-8 rounded-lg border border-gray-500 text-white font-bold hover:opacity-60`}
        onClick={() => setSortRecipes(SortRecipesEnum.CREATED_AT)}
      >
        Recent
      </button>
      <button
        className={`${
          sortRecipes === SortRecipesEnum.AVERAGE_VOTE
            ? 'bg-gray-800'
            : 'bg-gray-400'
        } px-4 py-1 rounded-lg border border-gray-500 text-white font-bold hover:opacity-60`}
        onClick={() => setSortRecipes(SortRecipesEnum.AVERAGE_VOTE)}
      >
        Popular
      </button>
    </nav>
  );
};

export default RecipesNav;
