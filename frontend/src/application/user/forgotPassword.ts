import { useUser } from '@Services/userAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { AlertMessages, MessageTypes } from '@Enums/config/messages.enum';

export function useForgotPassword() {
  const { setForgotPassword } = useUser();
  const [forgotPasswordMutation] = setForgotPassword();
  const { notify } = useNotifier();

  const forgotPassword = async ({ email }: { email: string }) => {
    try {
      const response = await forgotPasswordMutation({
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

  return { forgotPassword };
}
