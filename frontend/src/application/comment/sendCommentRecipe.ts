import { useComment } from '@Services/commentAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { MessageTypes } from '@Enums/config/messages.enum';
import { IRecipe } from '@Interfaces/domain/recipe.interface';

export function useSendCommentRecipe({
  recipeUrl,
}: {
  recipeUrl: IRecipe['url'];
}) {
  const { setSendCommentRecipe } = useComment();
  const [sendCommentRecipeMutation] = setSendCommentRecipe({ recipeUrl });
  const { notify } = useNotifier();

  const sendCommentRecipe = async ({
    message,
    recipeUrl,
  }: {
    message: string;
    recipeUrl: IRecipe['url'];
  }) => {
    try {
      return await sendCommentRecipeMutation({
        variables: {
          recipeUrl,
          input: {
            message,
          },
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

  return { sendCommentRecipe };
}
