import { useUser } from '@Services/userAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { AlertMessages, MessageTypes } from '@Enums/config/messages.enum';

export function useUpdateUser() {
  const { setUpdateUser } = useUser();
  const [updateUserMutation] = setUpdateUser();
  const { notify } = useNotifier();

  const updateUser = async ({
    name,
    password,
    email,
  }: {
    name: string;
    password: string;
    email?: string;
  }) => {
    try {
      const response = await updateUserMutation({
        variables: {
          input: {
            name,
            password,
            email,
          },
        },
      });

      notify({
        message: AlertMessages.PROFILE_UPDATED,
        messageType: MessageTypes.SUCCESS,
      });

      return response;
    } catch (error) {
      if (error instanceof Error) {
        notify({
          message: error.message.replace('GraphQL error: ', ''),
          messageType: MessageTypes.ERROR,
        });
      }
    }
  };

  return { updateUser };
}
