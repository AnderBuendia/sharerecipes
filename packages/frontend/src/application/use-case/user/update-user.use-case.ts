import { useUser } from '@Services/userAdapter';
import { useNotifier } from '@Services/notification.service';
import { FormMessages, AlertMessages } from '@Enums/config/messages.enum';

export function useUpdateUser() {
  const { setUpdateUser } = useUser();
  const [update_user] = setUpdateUser();
  const { notifySuccess, notifyError } = useNotifier();

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
      if (!email) throw new Error(FormMessages.EMAIL_REQUIRED);

      const response = await update_user({
        variables: {
          input: {
            name,
            password,
            email,
          },
        },
      });

      notifySuccess({ message: AlertMessages.PROFILE_UPDATED });

      return response;
    } catch (error) {
      if (error instanceof Error) {
        notifyError({ message: error.message.replace('GraphQL error: ', '') });
      }
    }
  };

  return { updateUser };
}
