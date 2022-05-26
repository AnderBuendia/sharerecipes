import { useComment } from '@Services/commentAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import type { IComment } from '@Interfaces/domain/comment.interface';
import { MessageTypes } from '@Enums/config/messages.enum';

export function useEditComment() {
  const { setEditComment } = useComment();
  const [edit_comment] = setEditComment();
  const { notify } = useNotifier();

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
        notify({
          message: error.message.replace('GraphQL error: ', ''),
          messageType: MessageTypes.ERROR,
        });
      }
    }
  };

  return { editComment };
}
