import type { FC } from 'react';
import { SortRecipesEnum } from '@Enums/sort-recipes.enum';

const DEFAULT_SORT_RECIPES = 'Recent';

const LABEL_BUTTON: { [key: string]: string } = {
  [SortRecipesEnum.CREATED_AT]: 'Recent',
  [SortRecipesEnum.AVERAGE_VOTE]: 'Popular',
};

export type SortRecipesButtonProps = {
  sortRecipes: string;
  handleSortRecipes: (value: string) => void;
  sortValue: string;
};

const SortRecipesButton: FC<SortRecipesButtonProps> = ({
  sortRecipes,
  handleSortRecipes,
  sortValue,
}) => {
  const label = LABEL_BUTTON[sortValue] || DEFAULT_SORT_RECIPES;
  const buttonColor = sortRecipes === sortValue ? 'bg-gray-800' : 'bg-gray-400';

  return (
    <button
      className={`${buttonColor} mx-3 px-4 py-1 rounded-lg border border-gray-500 text-white font-bold hover:opacity-60`}
      onClick={() => handleSortRecipes(sortValue)}
    >
      {label}
    </button>
  );
};

export default SortRecipesButton;
