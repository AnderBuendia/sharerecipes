import { useComment } from '@Services/commentAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import type { IComment } from '@Interfaces/domain/comment.interface';
import { MessageTypes } from '@Enums/config/messages.enum';

const DEFAULT_NUMBER_OF_VOTES = 1;

export function useVoteComment() {
  const { setVoteComment } = useComment();
  const [vote_comment] = setVoteComment();
  const { notify } = useNotifier();

  const voteComment = async ({ commentId }: { commentId: IComment['_id'] }) => {
    try {
      return await vote_comment({
        variables: {
          commentId,
          input: {
            votes: DEFAULT_NUMBER_OF_VOTES,
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

  return { voteComment };
}
