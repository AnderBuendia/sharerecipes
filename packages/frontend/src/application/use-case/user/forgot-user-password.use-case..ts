import { useUser } from '@Services/userAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { AlertMessages, MessageTypes } from '@Enums/config/messages.enum';

export function useForgotUserPassword() {
  const { setForgotUserPassword } = useUser();
  const [forgot_user_password] = setForgotUserPassword();
  const { notify } = useNotifier();

  const forgotUserPassword = async ({ email }: { email: string }) => {
    try {
      const response = await forgot_user_password({
        variables: {
          input: {
            email,
          },
        },
      });

      notify({
        message: AlertMessages.CHECK_ACTIVATION_MAIL,
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

  return { forgotUserPassword };
}
