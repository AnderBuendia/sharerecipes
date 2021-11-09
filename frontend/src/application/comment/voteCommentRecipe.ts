import { useComment } from '@Services/commentAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { IComment } from '@Interfaces/domain/comment.interface';
import { MessageTypes } from '@Enums/config/messages.enum';

export function useVoteCommentRecipe() {
  const { setVoteCommentRecipe } = useComment();
  const [voteCommentRecipeMutation] = setVoteCommentRecipe();
  const { notify } = useNotifier();

  const voteCommentRecipe = async ({
    commentId,
  }: {
    commentId: IComment['_id'];
  }) => {
    try {
      return await voteCommentRecipeMutation({
        variables: {
          _id: commentId,
          input: {
            votes: 1,
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

  return { voteCommentRecipe };
}
