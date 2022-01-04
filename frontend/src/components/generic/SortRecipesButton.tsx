import { FC } from 'react';
import { SortRecipesEnum } from '@Enums/sort-recipes.enum';

export type SortRecipesButtonProps = {
  sortRecipes: string;
  handleSortRecipes: (value: string) => void;
  sortValue: string;
};

const LABEL_BUTTON: { [key: string]: string } = {
  [SortRecipesEnum.CREATED_AT]: 'Recent',
  [SortRecipesEnum.AVERAGE_VOTE]: 'Popular',
};

const SortRecipesButton: FC<SortRecipesButtonProps> = ({
  sortRecipes,
  handleSortRecipes,
  sortValue,
}) => {
  const label = LABEL_BUTTON[sortValue] || 'Recent';

  return (
    <button
      className={`${
        sortRecipes === sortValue ? 'bg-gray-800' : 'bg-gray-400'
      } px-4 py-1 mr-8 rounded-lg border border-gray-500 text-white font-bold hover:opacity-60`}
      onClick={() => handleSortRecipes(sortValue)}
    >
      {label}
    </button>
  );
};

export default SortRecipesButton;
