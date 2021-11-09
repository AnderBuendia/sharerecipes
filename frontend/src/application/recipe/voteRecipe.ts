import { useRecipe } from '@Services/recipeAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { MessageTypes } from '@Enums/config/messages.enum';

export function useVoteRecipe() {
  const { setVoteRecipe } = useRecipe();
  const [voteRecipeMutation] = setVoteRecipe();
  const { notify } = useNotifier();

  const voteRecipe = async ({ url, votes }: { url: string; votes: number }) => {
    try {
      await voteRecipeMutation({
        variables: {
          recipeUrl: url,
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
