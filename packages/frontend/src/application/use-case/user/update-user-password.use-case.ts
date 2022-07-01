import { useUser } from '@Services/userAdapter';
import { useNotifier } from '@Services/notification.service';
import { FormMessages, AlertMessages } from '@Enums/config/messages.enum';

export function useUpdateUserPassword() {
  const { setUpdateUserPassword } = useUser();
  const [update_user_password] = setUpdateUserPassword();
  const { notifySuccess, notifyError } = useNotifier();

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
      if (!email) throw new Error(FormMessages.EMAIL_REQUIRED);

      const response = await update_user_password({
        variables: {
          input: {
            password,
            confirmPassword,
            email,
          },
        },
      });

      notifySuccess({ message: AlertMessages.PASSWORD_UPDATED });

      return response;
    } catch (error) {
      if (error instanceof Error) {
        notifyError({ message: error.message.replace('GraphQL error: ', '') });
      }
    }
  };

  return { updateUserPassword };
}
