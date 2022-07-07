import { useComment } from '@Services/comment.service';
import { useNotifier } from '@Services/notification.service';
import type { IRecipe } from '@Interfaces/domain/recipe.interface';

export function useSendRecipeComment({
  recipeUrlQuery,
}: {
  recipeUrlQuery: IRecipe['urlQuery'];
}) {
  const { setSendRecipeComment } = useComment();
  const [send_recipe_comment] = setSendRecipeComment({ recipeUrlQuery });
  const { notifyError } = useNotifier();

  const sendRecipeComment = async ({
    message,
    recipeUrlQuery,
  }: {
    message: string;
    recipeUrlQuery: IRecipe['urlQuery'];
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
        notifyError({ message: error.message.replace('GraphQL error: ', '') });
      }
    }
  };

  return { sendRecipeComment };
}
