import { useUser } from '@Services/userAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { AlertMessages, MessageTypes } from '@Enums/config/messages.enum';

export function useResetPassword() {
  const { setResetPassword } = useUser();
  const [resetPasswordMutation] = setResetPassword();
  const { notify } = useNotifier();

  const resetPassword = async ({
    password,
    token,
  }: {
    password: string;
    token: string;
  }) => {
    try {
      const response = await resetPasswordMutation({
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

  return { resetPassword };
}
