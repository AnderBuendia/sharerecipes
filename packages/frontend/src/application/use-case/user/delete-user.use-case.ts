import { useUser } from '@Services/userAdapter';
import { useNotifier } from '@Services/notification.service';
import type { UserProfile } from '@Interfaces/domain/user.interface';

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
  const { notifyError } = useNotifier();

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
        notifyError({ message: error.message.replace('GraphQL error: ', '') });
      }
    }
  };

  return { deleteUser };
}
