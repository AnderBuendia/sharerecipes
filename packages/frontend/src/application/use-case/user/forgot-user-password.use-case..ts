import { useUser } from '@Services/userAdapter';
import { useNotifier } from '@Services/notification.service';
import { AlertMessages } from '@Enums/config/messages.enum';

export function useForgotUserPassword() {
  const { setForgotUserPassword } = useUser();
  const [forgot_user_password] = setForgotUserPassword();
  const { notifySuccess, notifyError } = useNotifier();

  const forgotUserPassword = async ({ email }: { email: string }) => {
    try {
      const response = await forgot_user_password({
        variables: {
          input: {
            email,
          },
        },
      });

      notifySuccess({ message: AlertMessages.CHECK_ACTIVATION_MAIL });

      return response;
    } catch (error) {
      if (error instanceof Error) {
        notifyError({ message: error.message.replace('GraphQL error: ', '') });
      }
    }
  };

  return { forgotUserPassword };
}
