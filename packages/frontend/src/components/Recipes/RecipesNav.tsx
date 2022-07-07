import type { FC } from 'react';
import { useRecipeStorage } from '@Services/storage.service';
import SortRecipesButton from '@Components/generic/SortRecipesButton';
import { SortRecipesEnum } from '@Enums/sort-recipes.enum';

const RecipesNav: FC = () => {
  const { sortRecipes, setSortRecipes } = useRecipeStorage();

  const handleSortRecipes = (value: string) => {
    setSortRecipes(value);
  };

  return (
    <nav className="flex flex-row justify-center items-center mb-4">
      <SortRecipesButton
        sortRecipes={sortRecipes}
        handleSortRecipes={handleSortRecipes}
        sortValue={SortRecipesEnum.CREATED_AT}
      />

      <SortRecipesButton
        sortRecipes={sortRecipes}
        handleSortRecipes={handleSortRecipes}
        sortValue={SortRecipesEnum.AVERAGE_VOTE}
      />
    </nav>
  );
};

export default RecipesNav;
