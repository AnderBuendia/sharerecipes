import { useUser } from '@Services/userAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { AlertMessages, MessageTypes } from '@Enums/config/messages.enum';

export function useResetUserPassword() {
  const { setResetUserPassword } = useUser();
  const [reset_user_password] = setResetUserPassword();
  const { notify } = useNotifier();

  const resetUserPassword = async ({
    password,
    token,
  }: {
    password: string;
    token: string;
  }) => {
    try {
      const response = await reset_user_password({
        variables: {
          input: {
            token,
            password,
          },
        },
      });

      notify({
        message: AlertMessages.PASSWORD_UPDATED_LOGIN,
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

  return { resetUserPassword };
}
