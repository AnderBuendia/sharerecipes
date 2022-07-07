import { useUser } from '@Services/user.service';
import { useNotifier } from '@Services/notification.service';
import { AlertMessages } from '@Enums/config/messages.enum';

export function useResetUserPassword() {
  const { setResetUserPassword } = useUser();
  const [reset_user_password] = setResetUserPassword();
  const { notifySuccess, notifyError } = useNotifier();

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

      notifySuccess({ message: AlertMessages.PASSWORD_UPDATED_LOGIN });

      return response;
    } catch (error) {
      if (error instanceof Error) {
        notifyError({ message: error.message.replace('GraphQL error: ', '') });
      }
    }
  };

  return { resetUserPassword };
}
