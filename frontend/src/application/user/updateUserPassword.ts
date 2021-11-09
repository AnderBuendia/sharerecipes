import { useUser } from '@Services/userAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { AlertMessages, MessageTypes } from '@Enums/config/messages.enum';

export function useUpdateUserPassword() {
  const { setUpdateUserPassword } = useUser();
  const [updateUserPasswordMutation] = setUpdateUserPassword();
  const { notify } = useNotifier();

  const updateUserPassword = async ({
    password,
    confirmPassword,
    email,
  }: {
    password: string;
    confirmPassword: string;
    email?: string;
  }) => {
    try {
      const response = await updateUserPasswordMutation({
        variables: {
          input: {
            password,
            confirmPassword,
            email,
          },
        },
      });

      notify({
        message: AlertMessages.PASSWORD_UPDATED,
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

  return { updateUserPassword };
}
