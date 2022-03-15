import { useComment } from '@Services/commentAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { MessageTypes } from '@Enums/config/messages.enum';
import { IRecipe } from '@Interfaces/domain/recipe.interface';

export function useSendRecipeComment({
  recipeUrlQuery,
}: {
  recipeUrlQuery: IRecipe['url_query'];
}) {
  const { setSendRecipeComment } = useComment();
  const [send_recipe_comment] = setSendRecipeComment({ recipeUrlQuery });
  const { notify } = useNotifier();

  const sendRecipeComment = async ({
    message,
    recipeUrlQuery,
  }: {
    message: string;
    recipeUrlQuery: IRecipe['url_query'];
  }) => {
    try {
      return await send_recipe_comment({
        variables: {
          recipeUrlQuery,
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

  return { sendRecipeComment };
}
