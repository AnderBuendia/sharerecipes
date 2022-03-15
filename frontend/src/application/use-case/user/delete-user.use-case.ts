import { useUser } from '@Services/userAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { UserProfile } from '@Interfaces/domain/user.interface';
import { MessageTypes } from '@Enums/config/messages.enum';

export function useDeleteUser({
  offset,
  limit,
  email,
}: {
  offset: number;
  limit: number;
  email: UserProfile['email'];
}) {
  const { setDeleteUser } = useUser();
  const [delete_user] = setDeleteUser({ offset, limit, email });
  const { notify } = useNotifier();

  const deleteUser = async ({ email }: { email: UserProfile['email'] }) => {
    try {
      return await delete_user({
        variables: {
          input: {
            email,
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

  return { deleteUser };
}
