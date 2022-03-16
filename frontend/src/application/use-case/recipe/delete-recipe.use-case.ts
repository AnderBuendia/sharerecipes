import { useRecipe } from '@Services/recipeAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { MessageTypes } from '@Enums/config/messages.enum';
import type { IRecipe } from '@Interfaces/domain/recipe.interface';

export function useDeleteRecipe({ recipeId }: { recipeId: IRecipe['_id'] }) {
  const { setDeleteRecipe } = useRecipe();
  const [delete_recipe] = setDeleteRecipe({ recipeId });
  const { notify } = useNotifier();

  const deleteRecipe = async ({ recipeId }: { recipeId: IRecipe['_id'] }) => {
    try {
      return await delete_recipe({
        variables: {
          recipeId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        notify({
          message: error.message.replace('GraphQL error: ', ''),
          messageType: MessageTypes.ERROR,
        });
      }
    }
  };

  return { deleteRecipe };
}
