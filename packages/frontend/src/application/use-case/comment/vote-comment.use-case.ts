import { useComment } from '@Services/comment.service';
import { useNotifier } from '@Services/notification.service';
import type { IComment } from '@Interfaces/domain/comment.interface';

const DEFAULT_NUMBER_OF_VOTES = 1;

export function useVoteComment() {
  const { setVoteComment } = useComment();
  const [vote_comment] = setVoteComment();
  const { notifyError } = useNotifier();

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
        notifyError({ message: error.message.replace('GraphQL error: ', '') });
      }
    }
  };

  return { voteComment };
}
