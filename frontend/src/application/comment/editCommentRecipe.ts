import { useComment } from '@Services/commentAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { MessageTypes } from '@Enums/config/messages.enum';
import { IComment } from '@Interfaces/domain/comment.interface';

export function useEditCommentRecipe() {
  const { setEditCommentRecipe } = useComment();
  const [editCommentRecipeMutation] = setEditCommentRecipe();
  const { notify } = useNotifier();

  const editCommentRecipe = async ({
    commentId,
    message,
  }: {
    commentId: IComment['_id'];
    message: string;
  }) => {
    try {
      return await editCommentRecipeMutation({
        variables: {
          _id: commentId,
          input: {
            message,
            edited: true,
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

  return { editCommentRecipe };
}
