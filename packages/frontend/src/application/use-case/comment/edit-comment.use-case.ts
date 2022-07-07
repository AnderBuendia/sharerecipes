import { useComment } from '@Services/comment.service';
import { useNotifier } from '@Services/notification.service';
import type { IComment } from '@Interfaces/domain/comment.interface';

export function useEditComment() {
  const { setEditComment } = useComment();
  const [edit_comment] = setEditComment();
  const { notifyError } = useNotifier();

  const editComment = async ({
    commentId,
    message,
  }: {
    commentId: IComment['_id'];
    message: string;
  }) => {
    try {
      return await edit_comment({
        variables: {
          commentId,
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

  return { editComment };
}
