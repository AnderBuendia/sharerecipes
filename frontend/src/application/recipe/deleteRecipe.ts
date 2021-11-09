import { useRecipe } from '@Services/recipeAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { IRecipe } from '@Interfaces/domain/recipe.interface';
import { MessageTypes } from '@Enums/config/messages.enum';

export function useDeleteRecipe({ recipeId }: { recipeId: IRecipe['_id'] }) {
  const { setDeleteRecipe } = useRecipe();
  const [deleteRecipeMutation] = setDeleteRecipe({ recipeId });
  const { notify } = useNotifier();

  const deleteRecipe = async ({ recipeId }: { recipeId: IRecipe['_id'] }) => {
    try {
      return await deleteRecipeMutation({
        variables: {
          _id: recipeId,
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
