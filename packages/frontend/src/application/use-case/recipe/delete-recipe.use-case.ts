import { useRecipe } from '@Services/recipeAdapter';
import { useNotifier } from '@Services/notification.service';
import type { IRecipe } from '@Interfaces/domain/recipe.interface';

export function useDeleteRecipe({ recipeId }: { recipeId: IRecipe['_id'] }) {
  const { setDeleteRecipe } = useRecipe();
  const [delete_recipe] = setDeleteRecipe({ recipeId });
  const { notifyError } = useNotifier();

  const deleteRecipe = async ({ recipeId }: { recipeId: IRecipe['_id'] }) => {
    try {
      return await delete_recipe({
        variables: {
          recipeId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        notifyError({ message: error.message.replace('GraphQL error: ', '') });
      }
    }
  };

  return { deleteRecipe };
}
