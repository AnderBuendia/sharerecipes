import { useRecipe } from '@Services/recipeAdapter';
import { useNotifier } from '@Services/notification.service';

export function useVoteRecipe() {
  const { setVoteRecipe } = useRecipe();
  const [vote_recipe] = setVoteRecipe();
  const { notifyError } = useNotifier();

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
        notifyError({ message: error.message.replace('GraphQL error: ', '') });
      }
    }
  };

  return { voteRecipe };
}
