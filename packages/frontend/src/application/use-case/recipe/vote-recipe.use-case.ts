import { useRecipe } from '@Services/recipeAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { MessageTypes } from '@Enums/config/messages.enum';

export function useVoteRecipe() {
  const { setVoteRecipe } = useRecipe();
  const [vote_recipe] = setVoteRecipe();
  const { notify } = useNotifier();

  const voteRecipe = async ({
    recipeUrlQuery,
    votes,
  }: {
    recipeUrlQuery: string;
    votes: number;
  }) => {
    try {
      await vote_recipe({
        variables: {
          recipeUrlQuery,
          input: {
            votes,
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

  return { voteRecipe };
}
